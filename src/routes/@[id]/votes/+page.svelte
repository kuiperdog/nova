<script lang="ts">
    import { getContext } from "svelte";
    import { type Writable } from "svelte/store";
    import { formatEther } from "ethers";
    import { getArtists, getAssets } from "$lib/utils/artists";
    import { Vote } from "$lib/utils/model";
    import { __SUBSQUID_API__, __COSMO_PROXY__ } from "$env/static/public";
    import { t } from 'svelte-i18n';

    const address: Writable<string> = getContext("address");
    let gravities: (Cosmo.Gravity & { pollDetails: (Cosmo.PollDetail & { votes: Vote[] })[] })[];
    let artists: Cosmo.Artist[];

    getArtists().then(a => {
        artists = a;
        load();
    });
    
    async function load() {
        const listRes = await fetch(`${__COSMO_PROXY__}/gravity/v3`);
        const listData = await listRes.json();
        const list: Cosmo.Gravity[] = [ ...listData.upcoming, ...listData.ongoing, ...listData.past];

        const votesRes = await fetch(__SUBSQUID_API__, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                query: `
                    query {
                        votesConnection(orderBy: timestamp_DESC, where: {from_eq: "${$address}"}) {
                            edges {
                                node {
                                    ${Object.keys(new Vote).join('\n')}
                                }
                            }
                        }
                    }
                `
            })
        });
        const votesData = await votesRes.json();
        const votes: Vote[] = votesData.data.votesConnection.edges.map((e: { node: Vote }) => e.node);

        const polls = votes.reduce((acc: (Cosmo.Poll & { votes: Vote[], gravity: Cosmo.Gravity })[], vote: Vote) => {
            const entry = acc.find(poll => poll.votes.find(v => v.poll === vote.poll && v.contract === vote.contract));

            if (entry) {
                entry.votes.unshift(vote);
            } else {
                const artist = artists.find(a => a.contracts.Governor.toLowerCase() === vote.contract);

                for (const gravity of list) {
                    if (gravity.artist !== artist?.name)
                        continue;

                    const poll = getPoll(vote, gravity);
                    if (!poll)
                        continue;

                    acc.push({ ...poll, votes: [vote], gravity: gravity });
                    break;
                }
            }

            return acc;
        }, []);

        const pollArtists = polls.reduce((acc: Cosmo.Poll[][], poll: Cosmo.Poll) => {
            const polls = acc.find(a => a[0].artist === poll.artist);
            if (polls)
                polls.push(poll);
            else
                acc.push([poll]);
            return acc;
        }, []);

        const details = (await Promise.all(pollArtists.map(async (polls) => {
            const res = await fetch(`${__COSMO_PROXY__}/gravity/v3.1/${polls[0].artist}/polls/${polls.map(p => p.id).join(',')}`);
            return await res.json();
        }))).flat();

        gravities = details.reduce((acc: (Cosmo.Gravity & { pollDetails: (Cosmo.PollDetail & { votes: Vote[] })[] })[], detail: Cosmo.PollDetail) => {
            const entry = acc.find(g => g.id === detail.gravityId);
            const votes = polls.find(p => p.id === detail.id)!.votes;

            if (entry)
                entry.pollDetails.unshift({ ...detail, votes: votes });
            else
                acc.push({ ...list.find(g => g.id === detail.gravityId)!, pollDetails: [{ ...detail, votes: votes }] });
            
            return acc;
        }, []);
    }

    function getPoll(vote: Vote, gravity: Cosmo.Gravity): Cosmo.Poll | undefined {
            const inTimespan = (p: Cosmo.Poll) => (new Date(p.startDate).getTime() <= vote.timestamp && new Date(p.endDate).getTime() >= vote.timestamp);

            const pollFromChain = gravity.polls.find(p => p.pollIdOnChain == Number(vote.poll) && inTimespan(p));
            if (pollFromChain)
                return pollFromChain;

            const pollFromId = gravity.polls.find(p => p.id == Number(vote.poll) && inTimespan(p));
            if (pollFromId)
                return pollFromId;

            const pollBeforeId = gravity.polls.find(p => p.id - 1 == Number(vote.poll) && inTimespan(p));
            if (pollBeforeId)
                return pollBeforeId;

            return gravity.polls.find(p => p.id + 1 == Number(vote.poll) && inTimespan(p));
    }

    function pollTitle(poll: Cosmo.PollDetail, candidate: number) {
        const data = poll.pollViewMetadata;
        if (data.slots) {
            const map = data.choiceIdToSlotChoicesMapTable![candidate];
            return data.slots.map((slot, i) => `${slot.name}: ${data.slotChoices?.find(c => c.id === map.slotChoiceIds[i])?.name}`).join(', ');
        }
        
        return poll.choices[candidate].id;
    }
</script>

<div class="layout">
    {#if gravities}
        {#each gravities as gravity}
            <div class="gravity">
                <div class="header">
                    <b>{ gravity.title }</b>
                    <img src={gravity.bannerImageUrl} alt={gravity.title}>
                </div>
                <div class="content">
                    {#each gravity.pollDetails as poll}
                        {#if gravity.polls.length > 1}
                            <hr class="split">
                            <p class="poll"><b>{ poll.title }</b></p>
                            <hr class="split">
                        {/if}
                        {#each poll.votes as vote, i}
                            <p class="date">
                                {new Date(Number(vote.timestamp)).toLocaleDateString('en-US', {year: '2-digit', month: '2-digit', day: '2-digit'})},
                                {new Date(Number(vote.timestamp)).toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false})}
                            </p>
                            <hr class="vertical">
                            <div class="como">
                                { Number(formatEther(vote.amount)).toLocaleString('en-US') }
                                <img src={getAssets(artists.find(a => a.name === gravity.artist) || artists[0]).como} alt="COMO">
                            </div>
                            <hr class="vertical">
                            <div class="choice">
                                {#if vote.candidate === null}
                                    <p><i>{$t('profile.votes.unrevealed')}</i></p>
                                {:else if vote.candidate !== undefined}
                                    <img src={poll.choices[vote.candidate].txImageUrl} alt={poll.choices[vote.candidate].title}>
                                    <p>{ poll.choices[vote.candidate].title || pollTitle(poll, vote.candidate) }</p>
                                {/if}
                            </div>
                            {#if poll.votes.length > 1 && i < poll.votes.length - 1}
                                <hr class="split">
                            {/if}
                        {/each}
                    {/each}
                </div>
            </div>
        {/each}
    {:else}
        <div class="placeholder"></div>
        <div class="placeholder"></div>
        <div class="placeholder"></div>
        <div class="placeholder"></div>
        <div class="placeholder halfPlaceholder"></div>
    {/if}
</div>

<style>
    .layout {
        display: flex;
        flex-direction: column;
        padding: 40px 20px;
        gap: 20px;
        align-items: center;
    }

    .gravity {
        border-radius: 20px;
        overflow: hidden;
        text-align: center;
        animation: fade-in .1s;
    }

    .header {
        position: relative;
        padding: 20px;
        font-family: 'Halvar Breitschrift';
        font-size: 20px;
        text-shadow: var(--text-shadow);
        white-space: pre-line;
    }

    .header img {
        position: absolute;
        width: 100%;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        filter: blur(20px);
        -webkit-filter: blur(20px);
        z-index: -1;
    }

    .content {
        background-color: var(--item-color);
        display: grid;
        grid-template-columns: repeat(3, 1fr auto);
        align-items: center;
    }

    .content hr.vertical {
        height: 100%;
    }

    .content hr.split, .poll {
        grid-column: span 6;
    }

    .choice, .como {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 5px;
    }

    .choice {
        max-width: 200px;
    }

    .choice img {
        height: 25px;
        border-radius: 25px;
    }

    .como img {
        height: 20px;
    }

    .poll {
        background-color: var(--item-secondary);
        padding: 10px;
    }

    .choice, .como, .date {
        padding: 20px;
    }

    .placeholder {
        background-color: var(--placeholder-color);
        border-radius: 20px;
        width: 100%;
        max-width: 560px;
        height: 130px;
    }

    .halfPlaceholder {
        background: linear-gradient(to bottom, var(--placeholder-color), var(--placeholder-transparent));
    }
</style>