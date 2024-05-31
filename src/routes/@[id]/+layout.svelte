<script lang="ts">
    import copy_icon from '$lib/assets/icons/copy.svg';
    import polygonscan_icon from '$lib/assets/icons/polygonscan.svg';
    import opensea_icon from '$lib/assets/icons/opensea.svg';
    import date_icon from '$lib/assets/icons/date.svg';
    import { getArtists, getAssets } from '$lib/utils/artists';
    import { formatEther } from 'ethers';
	import { page } from '$app/stores';
    import { t, number } from 'svelte-i18n';
	import { replaceState } from '$app/navigation';

    export let data;

    data.user.then(user => {
        if (user.nickname && $page.params.id !== user.nickname)
            replaceState($page.url.pathname.replace($page.params.id, user.nickname) + $page.url.search, $page.state);
    });
</script>

<svelte:head>
    {#await data.user then user}
        {#key $page.route}
            <title>Nova | {user.nickname || user.address.slice(0, 6) + '...' + user.address.slice(-4)}</title>
        {/key}
    {/await}
</svelte:head>

<div class="layout">
    <div class="header">
        {#await data.user}
            <div class="profileImage placeholder"></div>
            <div class="name">
                <div class="placeholder" style:width="180px"></div>
                <div class="address">
                    <div class="placeholder" style:width="120px"></div>
                    <div class="placeholder" style:width="25px"></div>
                    <div class="placeholder" style:width="25px"></div>
                    <div class="placeholder" style:width="25px"></div>
                </div>
            </div>
        {:then user}
            <img class="profileImage" src="https://static.cosmo.fans/uploads/images/img_profile_gallag@3x.png" alt=''>
            <div class="name">
                {#if user.nickname}
                    <h1>{ user.nickname }</h1>
                {:else}
                    <h1><i>{$t('profile.no_id')}</i></h1>
                {/if}
                <div class="address">
                    <p>{ user.address.slice(0, 6) }...{ user.address.slice(-4) }</p>
                    <button class="copy" on:click={() => navigator.clipboard.writeText(user.address)}>
                        <img src={copy_icon} alt="Copy">
                    </button>
                    <a class="profileLink polygonscan" href="https://polygonscan.com/address/{user.address}">
                        <img src={polygonscan_icon} alt="PolygonScan">
                    </a>
                    <a class="profileLink opensea" href="https://opensea.io/{user.address}">
                        <img src={opensea_icon} alt="OpenSea">
                    </a>
                </div>
            </div>
        {/await}
        <div class="details">
            <div class="balances">
                {#await data.stats}
                    <div class="placeholder"></div>
                    <div class="placeholder"></div>
                {:then stats}
                    {#await getArtists() then artists}
                        {#each stats.balances as balance}
                            <div class="como">
                                <img src={getAssets(artists.find(a => a.contracts.Como.toLowerCase() === balance.contract) || artists[0]).como} alt="COMO">
                                { $number(Number(formatEther(balance.balance))) }
                            </div>
                        {/each}
                    {/await}
                {/await}
            </div>
            {#await data.stats}
                <div class="placeholder joinDatePlaceholder"></div>
            {:then stats}
                <div class="joinDate">
                    <img src={date_icon} alt="Joined">
                    <p>{ $t('profile.joindate', { values: { date: stats.joinDate.toLocaleDateString() } }) }</p>
                </div>
            {/await}
        </div>
    </div>
    {#await data.user}
        <div class="placeholder tabsPlaceholder"></div>
        <div class="contentPlaceholder"></div>
    {:then user}
        <div class="tabs">
            <a href="/@{user.nickname || user.address}" class:active={$page.route.id === '/@[id]'}>Objekts</a>
            <a href="/@{user.nickname || user.address}/trades" class:active={$page.route.id === '/@[id]/trades'}>{$t('profile.trades.title')}</a>
            <a href="/@{user.nickname || user.address}/votes" class:active={$page.route.id === '/@[id]/votes'}>{$t('profile.votes.title')}</a>
            <a href="/@{user.nickname || user.address}/como" class:active={$page.route.id === '/@[id]/como'}>COMO</a>
        </div>
        <slot/>
    {/await}
</div>

<style>
    .layout {
        min-height: 100%;
        display: flex;
        flex-direction: column;
    }

    .header {
        padding: 40px 20px;
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 20px;
    }

    h1 {
        font-family: 'Halvar Breitschrift';
        font-weight: bold;
        font-size: 36px;
    }

    .profileImage {
        height: 75px;
        width: 75px;
        border-radius: 75px;
    }

    .name {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        line-height: 100%;
        gap: 20px;
    }

    .address {
        color: #717F8D;
        font-size: 18px;
        flex-wrap: wrap;
    }

    .copy {
        background: none;
        height: 25px;
        padding: 2.5px;
        border: none;
        border-radius: 12.5px;
        transition: background-color .1s;
    }

    .copy img {
        height: 20px;
    }

    .copy:active {
        background-color: var(--item-color);
    }

    .profileLink {
        border-radius: 12.5px;
        height: 25px;
    }

    .profileLink img {
        height: 15px;
        margin: 5px;
    }

    .polygonscan {
        background-color: #8247E5;
    }

    .opensea {
        background-color: #2081E2;
    }

    .details {
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 10px;
        align-items: end;
    }

    .address, .balances {
        display: flex;
        gap: 10px;
        align-items: center;
    }

    .como {
        display: flex;
        background-color: var(--item-color);
        border: 1px solid var(--button-border);
        border-radius: 10px;
        padding: 5px;
        align-items: center;
    }

    .como img {
        height: 20px;
        width: 20px;
        margin-right: 10px;
    }

    .joinDate {
        display: flex;
        gap: 10px;
        align-items: center;
        background-color: var(--item-color);
        border-radius: 20px;
        padding: 5px 20px;
    }

    .joinDate img {
        height: 20px;
    }

    .placeholder {
        background-color: var(--placeholder-color);
    }

    .name .placeholder {
        height: 25px;
        border-radius: 25px;
    }

    .balances .placeholder {
        border-radius: 10px;
        width: 60px;
        height: 30px;
    }

    .joinDatePlaceholder {
        width: 185px;
        height: 30px;
        border-radius: 15px;
    }

    .tabs {
        display: flex;
        background-color: var(--item-color);
        padding: 5px;
        border-radius: 10px;
        gap: 10px;
        margin: 0 20px;
    }

    .tabs a {
        flex: 1;
        text-align: center;
        transition: back;
        padding: 10px 0;
        border-radius: 10px;
        border: 1px solid transparent;
        color: inherit;
        text-decoration: none;
        transition: background-color .1s, border-color .1s;
    }

    .tabs a.active {
        background-color: var(--item-secondary);
        border-color: var(--button-border);
    }

    .tabsPlaceholder {
        width: calc(100% - 40px);
        height: 50px;
        margin: 0 20px;
        border-radius: 10px;
    }

    .contentPlaceholder {
        width: calc(100% - 40px);
        height: 200px;
        margin: 40px 20px;
        border-radius: 20px;
        background: linear-gradient(to bottom, var(--placeholder-color), var(--placeholder-transparent));
    }

    .profileImage, .como, .joinDate, .name > *:not(.placeholder), .tabs {
        animation: fade-in 0.1s;
    }
    
    @media only screen and (max-width: 780px) {
        .profileImage {
            height: 50px;
            width: 50px;
        }

        h1 {
            font-size: 24px;
        }

        .header, .name {
            gap: 10px;
        }
    }

    @media only screen and (max-width: 600px) {
        .name {
            flex: initial;
        }

        .details {
            flex-basis: 100%;
            align-items: center;
        }

        .tabs {
            margin: 0 10px;
        }

        .tabsPlaceholder,
        .contentPlaceholder {
            width: calc(100% - 20px);
            margin-left: 10px;
            margin-right: 10px;
        }

        .contentPlaceholder {
            margin: 10px;
        }
    }
</style>