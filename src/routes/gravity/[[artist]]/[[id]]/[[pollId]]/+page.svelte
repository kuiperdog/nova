<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
    import { Cosmo, Polygon } from '$lib/data/apis';
    import { Contract, formatEther, hexlify } from 'ethers';
    import { MulticallProvider } from '@ethers-ext/provider-multicall';
    import { flip } from 'svelte/animate';
    import ArtistSelector from '$lib/components/common/ArtistSelector.svelte';
    import Votes from './Votes.svelte';
    import Graph from './Graph.svelte';
    import polygonscan_icon from '$lib/assets/icons/polygonscan.svg';

    let gravity: Cosmo.Gravity | undefined;
    let poll: Cosmo.PollDetail | undefined;
    let artist: Cosmo.Artist | undefined = undefined;
    let contract: Contract;
    let pollId: number;
    let interval: number;
    let countdown = -1;
    let revealedVotes: number;
    let totalVotes: number;
    let votesPerCandidates: number[];

    let _params: any;
    $: {
        if ($page.params !== _params) {
            if (!_params || $page.params.id !== _params.id || $page.params.artist !== _params.artist) {
                if (artist && artist.name !== $page.params.artist)
                    artist = undefined;
                gravity = undefined;
                poll = undefined;
                getGravity();
            } else if ($page.params.pollId !== _params.pollId) {
                poll = undefined;
                getPoll();
            }
        }
        _params = $page.params;
    };

    $: {
        if (artist && gravity && gravity.artist !== artist.name)
            goto(`/gravity/${artist.name}`);
    }

    async function getGravity() {
        if ($page.params.id) {
            const res = await fetch(`${Cosmo.URL}/gravity/v3/${$page.params.artist}/gravity/${$page.params.id}`);
            gravity = (await res.json()).gravity;
        } else {
            const res = await fetch(`${Cosmo.URL}/gravity/v3/${$page.params.artist || ''}`);
            const gravities = await res.json() as { 
                upcoming: Cosmo.Gravity[];
                ongoing: Cosmo.Gravity[];
                past: Cosmo.Gravity[];
            };

            if (gravities.ongoing.length)
                gravity = gravities.ongoing[0];
            else if (gravities.upcoming.length)
                gravity = gravities.upcoming.at(-1);
            else
                gravity = gravities.past[0];
        }

        artist = (await Cosmo.artists()).find(a => a.name === gravity?.artist);
        getPoll();
    }

    async function getPoll() {
        countdown = -1;
        window.clearInterval(interval);

        const id = $page.params.pollId || (gravity?.polls.find(p => !p.finalized) || gravity?.polls.at(-1))?.id;
        const res = await fetch(`${Cosmo.URL}/gravity/v3/${gravity?.artist}/gravity/${gravity?.id}/polls/${id}`);
        const pollDetail: Cosmo.PollDetail = (await res.json()).pollDetail;

        if (contract)
            contract.removeAllListeners();

        contract = new Contract(artist!.contracts.Governor, Polygon.ABI.Governor, Polygon.RPC);

        pollId = pollDetail.pollIdOnChain || pollDetail.id
        const candidates = await contract.candidates(pollId);
        if (candidates.toString() !== pollDetail.choices.map(c => c.id).toString())
            pollId -= 1;

        const multicall = new Contract(artist!.contracts.Governor, Polygon.ABI.Governor, new MulticallProvider(Polygon.RPC));
        const [ pollData, total, votes ] = await Promise.all([
            multicall.polls(pollId),
            multicall.totalVotes(pollId),
            multicall.votesPerCandidates(pollId)
        ]);
        revealedVotes = Number(pollData.revealedVotes);
        totalVotes = Number(total);
        votesPerCandidates = votes;
        
        if (Date.parse(pollDetail.endDate) > Date.now()) {
            interval = window.setInterval(() => {
                if (Date.parse(pollDetail.endDate) > Date.now())
                    countdown = Date.parse(pollDetail.endDate) - Date.now();
                else
                    startCount();
            }, 1000);
            countdown = Date.parse(pollDetail.endDate) - Date.now();
        } else if (revealedVotes < totalVotes) {
            startCount();
        }

        poll = pollDetail;
    }

    function startCount() {
        countdown = -1;
        window.clearInterval(interval);

        contract.on(contract.filters.Revealed(pollId), async (data) => {
            revealedVotes = Number(data.args.revealed);
            votesPerCandidates = await contract.votesPerCandidates(pollId);

            if (revealedVotes === totalVotes)
                contract.off(contract.filters.Revealed);
        }).catch((err) => {
            console.warn(`Error polling Revealed event: ${err}`);
        });
    }

    function slotChoiceComo(slotIndex: number, choiceId: string): number {
        return poll?.pollViewMetadata.choiceIdToSlotChoicesMapTable?.filter(m => {
            return m.slotChoiceIds[slotIndex] === choiceId;
        }).reduce((a, b) => {
            const candidate = poll?.pollViewMetadata.choiceIdToSlotChoicesMapTable?.indexOf(b);
            return a + Number(formatEther(votesPerCandidates[candidate!]));
        }, 0)!;
    }
</script>

<div class="layout">
    <div class="main">
        <div class="header">
            <div class="headerSection">
                {#if artist}
                    <ArtistSelector bind:selected={artist}/>
                {:else}
                    <div class="placeholder" style:width="85px"></div>
                {/if}
                {#if gravity}
                    <div class="gravityType {gravity.type}">
                        {#if gravity.type === 'event-gravity'}
                            Event
                        {:else if gravity.type === 'grand-gravity'}
                            Grand
                        {:else if gravity.type === 'solo-gravity'}
                            Solo
                        {/if}
                    </div>
                    <a class="polygonscan" href={gravity.contractOutlink} title="Poll ID: {pollId}">
                        <img src={polygonscan_icon} alt="PolygonScan">
                        PolygonScan
                    </a>
                {:else}
                    <div class="placeholder" style:width="50px"></div>
                    <div class="placeholder" style:margin-left="auto" style:width="135px"></div>
                {/if}
            </div>
            {#if gravity}
                <h1>
                    {@html gravity.title.replaceAll('\n', gravity.title.split('\n').length > 2 ? ' ' : '<br>')}
                </h1>
            {:else}
                <div class="titlePlaceholder">
                    <div class="placeholder"></div>
                    <div class="placeholder"></div>
                </div>
            {/if}
            <div class="headerSection">
                {#if gravity && poll}
                    {#if gravity.polls.length > 1}
                        <p>{ poll.title }</p>
                    {/if}
                    <p>{ new Date(poll.startDate).toLocaleDateString() }</p>
                    {#if countdown > -1 || revealedVotes < totalVotes}
                        <div class="liveIndicator">
                            <div class="dot"></div>
                        </div>
                        <p>LIVE</p>
                    {/if}
                {:else}
                    <div class="placeholder" style:width="50px"></div>
                    <div class="placeholder" style:width="150px"></div>
                    <div class="placeholder" style:margin-left="auto" style:width="65px"></div>
                {/if}
            </div>
        </div>
        {#if poll}
            {#if countdown > -1}
                <div class="item countdown">
                    {#if gravity && gravity.bannerImageUrl}
                        <img src={gravity.bannerImageUrl} alt={gravity.title}>
                    {/if}
                    <p>Counting will start in</p>
                    <h3>{String(Math.floor((countdown % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000))).padStart(2, '0') 
                        + ':' + String(Math.floor((countdown % (60 * 60 * 1000)) / (60 * 1000))).padStart(2, '0')
                        + ':' + String(Math.floor((countdown % (60 * 1000)) / 1000)).padStart(2, '0')}</h3>
                </div>
            {:else}
                <Graph contract={contract.target.toString().toLowerCase()} poll={pollId} {revealedVotes} {totalVotes}/>
                <div class="item polls">
                    {#if poll.pollViewMetadata.slots &&  poll.pollViewMetadata.slotChoices}
                        {#each poll.pollViewMetadata.slots as slot, slotIndex}
                            <div class="slot">
                                <p class="slotTitle">
                                    <img src={slot.backgroundImageUrl} alt={slot.name}>
                                    { slot.name }
                                </p>
                                {#each poll.pollViewMetadata.slotChoices.sort((a, b) => slotChoiceComo(slotIndex, b.id) - slotChoiceComo(slotIndex, a.id)) as choice (choice)}
                                {@const percent = Math.round(slotChoiceComo(slotIndex, choice.id) / votesPerCandidates.reduce((a, b) => a + Number(formatEther(b)), 0) * 100)}
                                    <div class="choice" animate:flip>
                                        <div class="choiceTitle">
                                            {#if choice.roundImageUrl}
                                                <img src={choice.roundImageUrl} alt={choice.name}>
                                            {/if}
                                            <p class="name">{choice.name}</p>
                                            <p>{slotChoiceComo(slotIndex, choice.id).toLocaleString('en-US')} COMO ({percent}%)</p>
                                        </div>
                                        <div class="choiceBar">
                                            <div class="progress" style:width="{percent}%"/>
                                        </div>
                                    </div>
                                {/each}
                            </div>
                            {#if slotIndex < poll.pollViewMetadata.slots.length - 1}
                                <hr>
                            {/if}
                        {/each}
                    {:else}
                        <div class="slot">
                            {#each [...votesPerCandidates].sort((a, b) => Number(b) - Number(a)) as vote, i (poll.choices[i])}
                            {@const percent = Math.round(Number(formatEther(vote)) / votesPerCandidates.reduce((a, b) => a + Number(formatEther(b)), 0) * 100)}
                                <div class="choice" animate:flip>
                                    <div class="choiceTitle">
                                        <img src={poll.choices[i].txImageUrl} alt={poll.choices[i].title}>
                                        <p class="name">{poll.choices[i].title}</p>
                                        <p>{Number(formatEther(vote)).toLocaleString('en-US')} COMO ({percent}%)</p>
                                    </div>
                                    <div class="choiceBar">
                                        <div class="progress" style:width="{percent}%"/>
                                    </div>
                                </div>
                            {/each}
                        </div>
                    {/if}
                </div>
            {/if}
        {:else}
            <div class="itemPlaceholder" style:height="250px"></div>
            <div class="itemPlaceholder" style:height="350px"></div>
        {/if}
    </div>
    <div class="sidebar">
        {#if poll}
            <Votes voteStart={Date.parse(poll.startDate)} voteEnd={Date.parse(poll.endDate)} {pollId}/>
        {:else}
            <div class="itemPlaceholder" style:flex="1"></div>
        {/if}
    </div>
</div>

<style>
    .layout {
        display: flex;
        height: 100%;
    }

    .main, .sidebar {
        display: flex;
        padding: 40px 20px;
        gap: 20px;
        flex-direction: column;
        height: 100%;
    }

    .main {
        flex: 1;
        overflow-y: scroll;
    }

    .sidebar {
        min-width: 325px;
    }

    h1 {
        font-family: 'Halvar Breitschrift';
        font-weight: bold;
        font-size: 36px;
    }

    .header {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 20px;
    }

    .headerSection {
        display: flex;
        gap: 20px;
        height: 25px;
        font-size: 20px;
        align-items: center;
    }

    .liveIndicator {
        margin-left: auto;
        margin-right: -10px;
        height: 15px;
        width: 15px;
        border-radius: 7.5px;
        background-color: #C8141D;
        animation: pulse 1s infinite;
    }

    .polygonscan {
        margin-left: auto;
        background-color: #8247E5;
        color: #FFFFFF;
        display: flex;
        align-items: center;
        gap: 5px;
        padding: 5px 10px;
        border-radius: 12.5px;
        height: 100%;
        font-size: 16px;
    }

    .polygonscan img {
        height: 100%;
    }

    .placeholder {
        background-color: var(--placeholder-color);
    }

    .headerSection > .placeholder {
        border-radius: 5px;
        height: 25px;
    }

    .titlePlaceholder {
        height: 84px;
        width: 75%;
    }

    .titlePlaceholder > .placeholder {
        height: 40%;
        width: 100%;
        margin: 1% 0;
        border-radius: 10px;
    }

    .titlePlaceholder div {
        flex: 1;
    }

    .gravityType {
        font-size: 14px;
        height: 100%;
        line-height: 25px;
        padding: 0 10px;
        border-radius: 5px;
        font-weight: bold;
    }

    .gravityType.event-gravity {
        background-color: #94E5FE;
        color: #0A6673;
    }

    .gravityType.grand-gravity {
        background-color: #fe94c6;
        color: #730a37;
    }

    .gravityType.solo-gravity {
        background-color: #c3fe94;
        color: #1d510b;
    }

    .history {
        margin-left: auto;
    }

    .item, .itemPlaceholder {
        background-color: var(--item-color);
        border-radius: 20px;
        padding: 20px;
    }

    .countdown {
        text-align: center;
        position: relative;
        overflow: hidden;
        padding: 80px 20px;
    }

    .countdown h3 {
        font-size: 36px;
        font-family: 'Dot-Matrix';
        padding-top: 20px;
    }

    .countdown img {
        position: absolute;
        width: 100%;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        filter: blur(20px);
        -webkit-filter: blur(20px);
        z-index: -1;
    }

    .countdown:has(img) {
        background: none;
        text-shadow: var(--text-shadow);
    }

    .polls {
        display: flex;
        gap: 20px;
    }

    .polls .slot {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 20px;
    }

    .slotTitle {
        font-size: 24px;
        font-weight: bold;
        display: flex;
        align-items: center;
        gap: 5px;
    }

    .slotTitle img {
        height: 24px;
        width: 24px;
        border-radius: 12px;
        object-fit: cover;
    }

    .choice {
        display: flex;
        flex-direction: column;
        gap: 5px;
    }

    .choiceTitle {
        width: 100%;
        display: flex;
        align-items: center;
        gap: 5px;
    }

    .choiceTitle .name {
        flex: 1;
    }

    .choiceTitle img {
        width: 20px;
        height: 20px;
        border-radius: 10px;
    }

    .choiceBar {
        height: 20px;
        width: 100%;
        border-radius: 10px;
        overflow: hidden;
        background-color: var(--item-secondary);
    }

    .choiceBar .progress {
        height: 100%;
        background-color: var(--accent-color);
        transition: width 0.1s;
    }

    .item,
    .headerSection > *:not(.placeholder),
    h1 {
        animation: fade-in 0.25s;
    }

    @media only screen and (max-width: 775px) {
        h1 {
            font-size: 32px;
        }

        .main {
            padding-right: 10px;
        }

        .sidebar {
            padding-left: 10px;
        }
    }


    @media only screen and (max-width: 700px) {
        h1 {
            font-size: 28px;
        }

        .headerSection {
            gap: 10px;
        }
    }


    @media only screen and (max-width: 675px) {
        .layout {
            flex-direction: column;
            height: auto;
            padding: 20px;
            gap: 20px;
        }

        .main, .sidebar {
            flex: initial;
            padding: 0;
        }

        .main {
            height: auto;
        }
    }


    @keyframes pulse {
        0% {
            box-shadow: 0 0 0 0 #C8141DBF;
        }

        100% {
            box-shadow: 0 0 0 7.5px #C8141D00;
        }
    }
</style>