<script lang="ts">
    import { onDestroy } from 'svelte';
    import { formatEther } from 'ethers';
    import { flip } from 'svelte/animate';
    import { Subsquid, Cosmo } from '$lib/data/apis';
    import { getAssets } from '$lib/data/assets';
    import { t } from 'svelte-i18n';

    export let voteStart: number;
    export let contract: string;
    export let poll: Cosmo.PollDetail;
    export let pollId: number;
    export let artist: Cosmo.Artist;

    let countdown = -1;
    let interval: number;
    let timeout: number;
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
            body: JSON.stringify({
                query: `
                    query {
                        votes(orderBy: amount_DESC, limit: 50, where: {contract_eq: "${contract.toLowerCase()}", poll_eq: "${pollId}"}) {
                            ${Object.keys(Subsquid.Vote).join('\n')}
                        }
                    }
                `
            })
        });
        const data = await res.json();

        const missingUsers = data.data.votes.filter((v: Subsquid.Vote) => !users.find(u => u.address === v.from)).map((v: Subsquid.Vote) => v.from);
        if (missingUsers.length) {
            const profiles = await fetch(`${Cosmo.URL}/user/v1/by-address/${missingUsers.join(',')}`);
            const profileData: Cosmo.User[] = await profiles.json();
            users = [
                ...users,
                ...profileData,
                ...missingUsers.filter((u: string) => !profileData.find(p => p.address === u)).map((u: string) => {
                    return { nickname: '', address: u, profileImageUrl: '' }
                })
            ];
        }

        votes = data.data.votes;
        if (!votes.length || votes.filter(v => v.candidate === null).length)
            timeout = window.setTimeout(load, 10000);
    }

    function pollTitle(poll: Cosmo.PollDetail, candidate: number) {
        const data = poll.pollViewMetadata;
        if (data.slots) {
            const map = data.choiceIdToSlotChoicesMapTable![candidate];
            return data.slots.map((slot, i) => `${slot.name}: ${data.slotChoices?.find(c => c.id === map.slotChoiceIds[i])?.alias}`).join(', ');
        }
        
        return poll.choices[candidate].id;
    }
    
    onDestroy(() => {
        window.clearInterval(interval);
        window.clearTimeout(timeout);
    });
</script>

{#if countdown > -1}
    <div class="countdown">
        <p>{$t('gravity.votes.countdown')}</p>
        <h3>{String(Math.floor(countdown / (60 * 60 * 1000))).padStart(2, '0') 
            + ':' + String(Math.floor((countdown % (60 * 60 * 1000)) / (60 * 1000))).padStart(2, '0')
            + ':' + String(Math.floor((countdown % (60 * 1000)) / 1000)).padStart(2, '0')}</h3>
    </div>
{:else}
    <div class="votes">
        <div class="header">
            <b>{$t('gravity.votes.title')}</b>
            <p>{$t('gravity.votes.subtitle')}</p>
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
                            {new Date(Number(vote.timestamp)).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })},
                            {new Date(Number(vote.timestamp)).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' })}
                        </span>
                        {#if vote.candidate !== null}
                            <p class="candidate">
                                <img src={poll.choices[vote.candidate].txImageUrl} alt="Choice">
                                { poll.choices[vote.candidate].title || pollTitle(poll, vote.candidate) }
                            </p>
                        {:else}
                            <i class="candidate">{$t('gravity.votes.unrevealed')}</i>
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
                        <div class="placeholder" style:width="80px"></div>
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
        flex: 2;
        overflow: auto;
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
        background-color: var(--item-color);
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

    .candidate {
        text-align: end;
        word-break: keep-all;
    }

    .placeholder {
        background-color: var(--item-secondary);
        border-radius: 5px;
        height: 20px;
    }
</style>