<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
    import { Cosmo, Polygon } from '$lib/data/apis';
    import { Contract, formatEther } from 'ethers';
    import { MulticallProvider } from '@ethers-ext/provider-multicall';
    import { flip } from 'svelte/animate';
    import ArtistSelector from '$lib/components/common/ArtistSelector.svelte';
    import Votes from './Votes.svelte';
    import Graph from './Graph.svelte';
    import History from './History.svelte';
    import polygonscan_icon from '$lib/assets/icons/polygonscan.svg';
    import { getAssets } from '$lib/data/assets';
    import { t } from 'svelte-i18n';
    import { onDestroy } from 'svelte'; 

    let gravity: Cosmo.Gravity | undefined;
    let poll: Cosmo.PollDetail | undefined;
    let artist: Cosmo.Artist | undefined = undefined;
    let gravityList: Cosmo.Gravity[] | undefined = undefined;
    let contract: Contract;
    let pollId: number;
    let interval: number;
    let countdown = -1;
    let revealedVotes: number;
    let totalVotes: number;
    let totalComo: number;
    let votesPerCandidates: bigint[];

    let _params: any;
    $: {
        if ($page.params !== _params) {
            if (!_params || $page.params.id !== _params.id || $page.params.artist !== _params.artist) {
                if (artist && artist.name !== $page.params.artist)
                    artist = gravityList = undefined;
                gravity = undefined;
                poll = undefined;
                window.clearInterval(interval);
                getGravity();
            } else if ($page.params.pollId !== _params.pollId) {
                poll = undefined;
                window.clearInterval(interval);
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
            if (gravityList && gravityList.find(g => g.id === Number($page.params.id))) {
                gravity = gravityList.find(g => g.id === Number($page.params.id));
            } else {
                const res = await fetch(`${Cosmo.URL}/gravity/v3/${$page.params.artist}/gravity/${$page.params.id}`);
                gravity = (await res.json()).gravity;
            }
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

            gravityList = [
                ...gravities.upcoming,
                ...gravities.ongoing,
                ...gravities.past
            ].filter(g => g.artist === gravity?.artist);
        }

        artist = (await Cosmo.artists()).find(a => a.name === gravity?.artist);
        getPoll();
    }

    async function getPoll() {
        countdown = -1;

        const sortedPolls = gravity?.polls.sort((a, b) => Date.parse(a.startDate) - Date.parse(b.startDate));
        const id = $page.params.pollId || (gravity?.polls.find(p => !p.finalized) || sortedPolls?.at(-1))?.id;
        const res = await fetch(`${Cosmo.URL}/gravity/v3/${gravity?.artist}/gravity/${gravity?.id}/polls/${id}`);
        const pollDetail: Cosmo.PollDetail = (await res.json()).pollDetail;

        contract = new Contract(artist!.contracts.Governor, Polygon.ABI.Governor, Polygon.RPC);

        pollId = pollDetail.pollIdOnChain || pollDetail.id;
        const candidates = await contract.candidates(pollId);
        if (candidates.toString().replaceAll('\b', '') !== pollDetail.choices.map(c => c.id).toString().replaceAll('\b', ''))
            pollId -= 1;

        const multicall = new Contract(artist!.contracts.Governor, Polygon.ABI.Governor, new MulticallProvider(Polygon.RPC));
        const [ pollData, total, votes ] = await Promise.all([
            multicall.polls(pollId),
            multicall.totalVotes(pollId),
            multicall.votesPerCandidates(pollId)
        ]);
        revealedVotes = Number(pollData.revealedVotes);
        totalVotes = Number(total);
        totalComo = Number(formatEther(pollData.totalVotedCOMO));
        votesPerCandidates = votes;
        
        if (Date.parse(pollDetail.endDate) > Date.now() || revealedVotes < totalVotes) {
            window.clearInterval(interval);
            countdown = Date.parse(pollDetail.endDate) - Date.now();
            interval = window.setInterval(async () => {
                if (Date.parse(pollDetail.endDate) > Date.now()) {
                    countdown = Date.parse(pollDetail.endDate) - Date.now();
                    const [ pollData, total ] = await Promise.all([
                        multicall.polls(pollId),
                        multicall.totalVotes(pollId)
                    ]);
                    totalComo = Number(formatEther(pollData.totalVotedCOMO));
                    totalVotes = Number(total);
                } else if (totalVotes === revealedVotes) {
                    window.clearInterval(interval);
                } else {
                    countdown = -1;
                    const [ pollData, votes ] = await Promise.all([
                        multicall.polls(pollId),
                        multicall.votesPerCandidates(pollId)
                    ]);
                    if (Number(pollData.revealedVotes) > revealedVotes) {
                        revealedVotes = Number(pollData.revealedVotes);
                        votesPerCandidates = votes;
                    }
                }
            }, 1000);
        }

        poll = pollDetail;
    }

    function slotChoiceComo(slotIndex: number, choiceId: string): number {
        return poll?.pollViewMetadata.choiceIdToSlotChoicesMapTable?.filter(m => {
            return m.slotChoiceIds[slotIndex] === choiceId;
        }).reduce((a, b) => {
            const candidate = poll?.pollViewMetadata.choiceIdToSlotChoicesMapTable?.indexOf(b);
            return a + Number(formatEther(votesPerCandidates[candidate!]));
        }, 0)!;
    }

    onDestroy(() => window.clearInterval(interval));
</script>

<svelte:head>
    {#if gravity}
        {#key $page.route}
            <title>Nova | {gravity.title.replaceAll('\n', ' ')}</title>
        {/key}
    {/if}
</svelte:head>

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
                    <p>{$t('gravity.counting_countdown')}</p>
                    <h3>{String(Math.floor(countdown / (60 * 60 * 1000))).padStart(2, '0')
                        + ':' + String(Math.floor((countdown % (60 * 60 * 1000)) / (60 * 1000))).padStart(2, '0')
                        + ':' + String(Math.floor((countdown % (60 * 1000)) / 1000)).padStart(2, '0')}</h3>
                </div>
            {:else}
                <Graph contract={contract.target.toString().toLowerCase()} poll={pollId} {revealedVotes} {totalVotes}/>
                <div class="item polls">
                    {#if poll.pollViewMetadata.slots && poll.pollViewMetadata.slotChoices}
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
                            {#each [...poll.choices].sort((a, b) => 
                                Number(votesPerCandidates[poll?.choices.indexOf(b) || 0]) - Number(votesPerCandidates[poll?.choices.indexOf(a) || 0])
                            ) as choice (choice)}
                            {@const percent = Math.round(Number(formatEther(votesPerCandidates[poll.choices.indexOf(choice)])) / totalComo * 100)}
                                <div class="choice" animate:flip>
                                    <div class="choiceTitle">
                                        <img src={choice.txImageUrl} alt={choice.title}>
                                        <p class="name">{choice.title}</p>
                                        <p>{Number(formatEther(votesPerCandidates[poll.choices.indexOf(choice)])).toLocaleString('en-US')} COMO ({percent}%)</p>
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
        {#if poll && artist}
            <div class="item total">
                <b>{$t('gravity.totalcomo')}</b>
                {#if totalComo !== undefined}
                    <p>{totalComo.toLocaleString('en-US')}</p>
                    <img src={getAssets(artist).como} alt="COMO">
                {/if}
            </div>
            <Votes voteStart={Date.parse(poll.startDate)} contract={contract.target.toString()} {poll} {pollId} {artist}/>
            <History bind:gravities={gravityList} {artist}/>
        {:else}
            <div class="itemPlaceholder"></div>
            <div class="itemPlaceholder" style:flex="2"></div>
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
        padding: 20px;
        padding-top: 40px;
        gap: 20px;
        flex-direction: column;
        height: 100%;
    }

    .main {
        flex: 1;
        overflow-y: auto;
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

    .item.total {
        display: flex;
        align-items: center;
        gap: 5px;
        height: 40px;
        padding-top: 0;
        padding-bottom: 0;
    }

    .item.total b {
        flex: 1;
    }

    .item.total img {
        height: 20px;
    }

    .item,
    .headerSection > *:not(.placeholder):not(.liveIndicator),
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

        .polls {
            flex-direction: column;
        }

        .polls .slot {
            flex: initial
        }
    }


    @media only screen and (max-width: 700px) {
        h1 {
            font-size: 28px;
        }

        .headerSection {
            gap: 10px;
        }

        .liveIndicator {
            margin-right: 0;
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