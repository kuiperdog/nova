<script lang="ts">
    import { createClient } from 'graphql-ws';
    import { onDestroy } from 'svelte';
    import { formatEther } from 'ethers';
    import { flip } from 'svelte/animate';
    import { Subsquid, Cosmo } from '$lib/data/apis';
    import { getAssets } from '$lib/data/assets';

    export let voteStart: number;
    export let contract: string;
    export let poll: Cosmo.PollDetail;
    export let pollId: number;
    export let artist: Cosmo.Artist;

    let countdown = -1;
    let interval: number;
    const client = createClient({ url: Subsquid.WS_URL });
    const query = `
        votes(orderBy: amount_DESC, limit: 50, where: {contract_eq: "${contract.toLowerCase()}", poll_eq: "${pollId}"})  {
            ${Object.keys(Subsquid.Vote).join('\n')}
        }
    `;
    let votes: Subsquid.Vote[] = [];
    let users: Cosmo.User[] = [];
    const como = getAssets(artist).como;

    if (voteStart > Date.now()) {
        interval = window.setInterval(() => {
            if (voteStart > Date.now()) {
                countdown = voteStart - Date.now();
            } else {
                load();
                countdown = -1;
                window.clearInterval(interval);
            }
        }, 1000);
        countdown = voteStart - Date.now();
    } else {
        load();
    }

    async function load() {
        const res = await fetch(Subsquid.URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: `query {${query}}` })
        });
        const data = await res.json();
        await processVotes(data.data.votes);

        if (!votes.length || votes.filter(v => v.candidate === null).length) {
            client.subscribe({ query: `subscrioption {${query}}` }, {
                next: async (data) => {
                    if (data.data) {
                        await processVotes(data.data.votes as Subsquid.Vote[]);
                        if (votes.length && !votes.filter(v => v.candidate === null).length)
                            client.dispose();
                    }
                },
                error: (error) => {
                    console.error('WS error: ', error);
                },
                complete: () => {}
            });
        }
    }

    async function processVotes(newVotes: Subsquid.Vote[]) {
        const missingUsers = newVotes.filter(v => !users.find(u => u.address === v.from)).map(v => v.from);
        if (missingUsers.length) {
            const profiles = await fetch(`${Cosmo.URL}/user/v1/by-address/${missingUsers.join(',')}`);
            const profileData: Cosmo.User[] = await profiles.json();
            users = [
                ...users,
                ...profileData,
                ...missingUsers.filter(u => !profileData.find(p => p.address === u)).map(u => {
                    return { nickname: '', address: u, profileImageUrl: '' }
                })
            ];
        }

        votes = newVotes;
    }
    
    onDestroy(() => {
        client.dispose();
        window.clearInterval(interval);
    });
</script>

{#if countdown > -1}
    <div class="countdown">
        <p>Voting will open in</p>
        <h3>{String(Math.floor((countdown % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000))).padStart(2, '0') 
            + ':' + String(Math.floor((countdown % (60 * 60 * 1000)) / (60 * 1000))).padStart(2, '0')
            + ':' + String(Math.floor((countdown % (60 * 1000)) / 1000)).padStart(2, '0')}</h3>
    </div>
{:else}
    <div class="votes">
        <div class="header">
            <b>Votes</b>
            <p>Showing top 50</p>
        </div>
        {#if votes.length}
            {#each votes as vote, i (vote.id)}
            {@const user = users.find(u => u.address === vote.from)}
                <div class="vote" animate:flip>
                    <a href="/@{user?.nickname || user?.address}">
                        <img class="profileImage" src="https://static.cosmo.fans/uploads/images/img_profile_gallag@3x.png" alt="User">
                        { user?.nickname || user?.address.slice(0, 6) + '...' + user?.address.slice(-4) }
                    </a>
                    <p>{ Number(formatEther(vote.amount)).toLocaleString('en-US') }</p>
                    <img src={como} alt="COMO">
                    <div class="details">
                        <span>
                            {new Date(Number(vote.timestamp)).toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit', hour12: false})}
                        </span>
                        {#if vote.candidate !== null}
                            <p class="candidate">
                                <img src={poll.choices[vote.candidate].txImageUrl} alt="Choice">
                                { poll.choices[vote.candidate].title }
                            </p>
                        {:else}
                            <i>Unrevealed</i>
                        {/if}
                    </div>
                </div>
            {/each}
        {:else}
            {#each { length: 50 } as _, i}
                <div class="vote">
                    <div class="placeholder" style:width="110px" style:margin-right="auto"></div>
                    <div class="placeholder" style:width="60px"></div>
                    <div class="details">
                        <div class="placeholder" style:width="40px"></div>
                        <div class="placeholder" style:width="110px"></div>
                    </div>
                </div>
            {/each}
        {/if}
    </div>
{/if}

<style>
    .votes, .countdown {
        background-color: var(--item-color);
        border-radius: 20px;
        flex: 1;
        overflow: scroll;
        max-height: 90vh;
    }

    .countdown {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        padding: 20px;
        gap: 20px;
    }

    .countdown h3 {
        font-size: 24px;
        font-family: 'Dot-Matrix';
    }

    .header, .vote {
        display: flex;
        padding: 10px 20px;
        justify-content: space-between;
        gap: 5px;
        border-bottom: 1px solid var(--button-border);
    }

    .header {
        padding: 20px;
        position: sticky;
        top: 0;
        background-color: inherit;
    }

    .vote {
        flex-wrap: wrap;
    }

    .details {
        flex-basis: 100%;
        width: 0;
        margin-top: 5px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 20px;
    }

    .vote a {
        color: inherit;
        margin-right: auto;
    }

    .vote a, .vote .candidate {
        display: flex;
        gap: 5px;
        align-items: center;
    }

    .vote img {
        height: 20px;
        border-radius: 10px;
    }

    .placeholder {
        background-color: var(--item-secondary);
        border-radius: 5px;
        height: 20px;
    }
</style>