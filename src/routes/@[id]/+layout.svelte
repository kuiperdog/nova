<script lang="ts">
    import copy_icon from '$lib/assets/icons/copy.svg';
    import polygonscan_icon from '$lib/assets/icons/polygonscan.svg';
    import opensea_icon from '$lib/assets/icons/opensea.svg';
    import date_icon from '$lib/assets/icons/date.svg';
    import status_error_icon from '$lib/assets/icons/status_error.svg';
    import { getAssets } from '$lib/data/assets';
    import { isAddress, formatEther } from 'ethers';
    import { Cosmo, Subsquid } from '$lib/data/apis';
	import { replaceState } from '$app/navigation';
	import { page } from '$app/stores';
    import { writable } from 'svelte/store';
    import { setContext } from 'svelte';

    export let data: { id: string };

    let profile: Cosmo.User | undefined;
    let joinDate: Date | undefined;
    let balances: Subsquid.Como[] | undefined;
    let nonexistent = false;
    let artists: Cosmo.Artist[] | undefined;
    Cosmo.artists().then(a => artists = a);

	const address = writable<string>();
    setContext("address", address);

	const como = writable<Subsquid.Como[]>();
    setContext("como", como);

    async function getProfile() {
        nonexistent = false;
        profile = undefined;
        joinDate = undefined;
        balances = undefined;

        if (isAddress(data.id)) {
            address.set(data.id);
            const res = await fetch(`${Cosmo.URL}/user/v1/by-address/${data.id}`);
            const users = await res.json();
            if (users[0]) {
                profile = users[0];
                replaceState(`/@${profile?.nickname}`, $page.state);
            } else {
                profile = {
                    address: data.id,
                    nickname: '',
                    profileImageUrl: ''
                };
            }
        } else {
            const res = await fetch(`${Cosmo.URL}/user/v1/by-nickname/${data.id}`);
            const user = await res.json();
            if (user.profile) {
                address.set(user.profile.address)
                profile = user.profile;
            } else {
                nonexistent = true;
                return;
            }
        }

        const res = await fetch(Subsquid.URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                query: `
                    query {
                        comos(orderBy: id_ASC, where: {owner_eq: "${profile?.address}"}) {
                            ${Object.keys(Subsquid.Como).join('\n')}
                        }
                        objekts(limit: 1, orderBy: received_ASC, where: {owner_eq: "${profile?.address}"}) {
                            received
                        }
                    }
                `
            })
        });
        const query = await res.json();

        balances = query.data.comos;
        como.set(balances!);
        joinDate = new Date(Number(query.data.objekts[0].received));
    }

    $: if (profile && profile.nickname !== $page.params.id && profile.address !== $page.params.id) {
        getProfile();
    }

    getProfile();
</script>

<svelte:head>
    {#if profile}
        {#key $page.route}
            <title>Nova | {profile.nickname || profile.address.slice(0, 6) + '...' + profile.address.slice(-4)}</title>
        {/key}
    {/if}
</svelte:head>

<div class="layout">
    <div class="header">
        {#if profile}
            <img class="profileImage" src="https://static.cosmo.fans/uploads/images/img_profile_gallag@3x.png" alt=''>
            <div class="name">
                {#if profile.nickname}
                    <h1>{ profile.nickname }</h1>
                {:else}
                    <h1><i>ID Unknown</i></h1>
                {/if}
                <div class="address">
                    <p>{ profile.address.slice(0, 6) }...{ profile.address.slice(-4) }</p>
                    <button class="copy" on:click={() => navigator.clipboard.writeText(profile?.address || '')}>
                        <img src={copy_icon} alt="Copy">
                    </button>
                    <a class="profileLink polygonscan" href="https://polygonscan.com/address/{profile.address}">
                        <img src={polygonscan_icon} alt="PolygonScan">
                    </a>
                    <a class="profileLink opensea" href="https://opensea.io/{profile.address}">
                        <img src={opensea_icon} alt="OpenSea">
                    </a>
                </div>
            </div>
        {:else}
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
        {/if}
        <div class="details">
            <div class="balances">
                {#if artists && balances}
                    {#each balances as balance}
                        <div class="como">
                            <img src={getAssets(artists.find(a => a.contracts.Como.toLowerCase() === balance.contract) || artists[0]).como} alt="COMO">
                            { Number(formatEther(balance.balance)).toLocaleString('en-US') }
                        </div>
                    {/each}
                {:else}
                    <div class="placeholder"></div>
                    <div class="placeholder"></div>
                {/if}
            </div>
            {#if joinDate}
                <div class="joinDate">
                    <img src={date_icon} alt="Joined">
                    <p>Joined {joinDate.toLocaleDateString()}</p>
                </div>
            {:else}
                <div class="placeholder joinDatePlaceholder"></div>
            {/if}
        </div>
    </div>
    {#if nonexistent}
        <div class="errorContainer">
            <div class="error">
                <img src={status_error_icon} alt="Error">
                <p>User not found</p>
            </div>
        </div>
    {:else if profile}
        <div class="tabs">
            <a href="/@{profile.nickname || profile.address}" class:active={$page.route.id === '/@[id]'}>Objekts</a>
            <a href="/@{profile.nickname || profile.address}/trades" class:active={$page.route.id === '/@[id]/trades'}>Trades</a>
            <a href="/@{profile.nickname || profile.address}/votes" class:active={$page.route.id === '/@[id]/votes'}>Votes</a>
            <a href="/@{profile.nickname || profile.address}/como" class:active={$page.route.id === '/@[id]/como'}>COMO</a>
        </div>
        <slot/>
    {:else}
        <div class="placeholder tabsPlaceholder"></div>
        <div class="contentPlaceholder"></div>
    {/if}
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

    .errorContainer {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .error {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 20px;
        font-size: 20px;
        background-color: var(--item-color);
        border-radius: 24px;
    }

    .error img {
        height: 30px;
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

    .profileImage, .como, .joinDate, .name > *:not(.placeholder), .tabs, .error {
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