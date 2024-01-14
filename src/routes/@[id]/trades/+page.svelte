<script lang="ts">
    import { ZeroAddress } from 'ethers';
    import { getContext, onDestroy } from 'svelte';
    import { type Writable } from 'svelte/store';
    import { pushState } from '$app/navigation';
    import { page } from '$app/stores';
    import { Cosmo, Subsquid } from '$lib/data/apis';
    import Checkbox from '$lib/components/common/Checkbox.svelte';
    import cosmo_logo from '$lib/assets/images/cosmo.png';
    import { t, number } from 'svelte-i18n';

    const limit = 25;
    const address: Writable<string> = getContext("address");

    let items: (Subsquid.Transfer & { objekt: (Subsquid.Objekt & { collection: Subsquid.Collection }) })[] | undefined;
    let total: number | undefined;
    let checked: boolean;
    let mints = false;
    let users: Cosmo.User[] = [];
    let loading = false;

    async function load() {
        loading = true;
        const query = await fetch(Subsquid.URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                query: `
                    query {
                        transfersConnection(orderBy: timestamp_DESC, first: ${limit}, ${items ? `after: "${items.length}"` : ''}, where:
                            { from_eq: "${$address}", OR: { to_eq: "${$address}"${mints ? '' : `, from_not_eq: "${ZeroAddress}"`} }}) {
                            ${ total === undefined ? `
                                totalCount
                            ` : `` }
                            edges {
                                node {
                                    ${Object.keys(Subsquid.Transfer).join('\n')}
                                    objekt {
                                        ${Object.keys(Subsquid.Objekt).join('\n')}
                                        collection {
                                            ${Object.keys(Subsquid.Collection).join('\n')}
                                        }
                                    }
                                }
                            }
                        }
                    }

                `
            })
        });
        
        const queryData = await query.json();
        if (total === undefined)
            total = queryData.data.transfersConnection.totalCount;

        if (queryData.data.transfersConnection.edges.length) {
            const addresses = new Set(
                queryData.data.transfersConnection.edges.reduce((acc: string[], e: { node: Subsquid.Transfer }) => {
                    return [...acc, e.node.to, e.node.from];
                }, [])
            );

            const profiles = await fetch(`${Cosmo.URL}/user/v1/by-address/${Array.from(addresses).join(',')}`);
            const profilesData = await profiles.json();
            users = Array.from(new Set([...users, ...profilesData]));
        }

        items = [...(items || []), ...queryData.data.transfersConnection.edges.map((e: { node: any }) => e.node)];
        loading = false;
    }

    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !loading)
            load();
    });
    onDestroy(() => observer.disconnect());

    const viewport = (node: HTMLElement, index: number) => {
        if (index > 0)
            return;

        observer.observe(node);
        return {
            destroy() {
                observer.unobserve(node);
            }
        }
    }

    $: if (checked !== mints) {
        checked = mints;
        total = items = undefined;
        load();
    }
</script>

<div class="layout">
    <div class="header">
        {#if total !== undefined}
            <h2 class="total">{$t('profile.trades.total', { values: { total: $number(total) } })}</h2>
        {:else}
            <div class="totalPlaceholder"></div>
        {/if}
        <Checkbox bind:checked={mints}>
            {$t('profile.trades.showmints')}
        </Checkbox>
    </div>
    <div class="items">
        {#if items}
            {#each items as item}
            {@const user = users.find(u => u.address === (item.to === $address ? item.from : item.to))}
                <div class="trade">
                    <p class="date">
                        {new Date(Number(item.timestamp)).toLocaleDateString('en-US', {year: '2-digit', month: '2-digit', day: '2-digit'})}
                        <br>
                        {new Date(Number(item.timestamp)).toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false})}
                    </p>
                    <button on:click={() => pushState(`/objekt/${item.objekt.collection.id}/${item.objekt.serial}`, 
                        { collection: item.objekt.collection, objekt: item.objekt, previous: $page.url.href })}>
                        { Subsquid.formatObjekt(item.objekt.collection, item.objekt) }
                    </button>
                    <div class="details">
                        <p class="type">
                            {#if item.from === ZeroAddress}
                                <span class="chip mint">{$t('profile.trades.chip.mint')}</span>
                            {:else if item.to === $address}
                                <span class="chip from">{$t('profile.trades.chip.from')}</span>
                            {:else}
                                <span class="chip to">{$t('profile.trades.chip.to')}</span>
                            {/if}
                        </p>
                        {#if user}
                            <a class="user" href="/@{user?.nickname}">
                                <img src="https://static.cosmo.fans/uploads/images/img_profile_gallag@3x.png" alt="User">
                                { user?.nickname }
                            </a>
                        {:else if item.from === ZeroAddress}
                            <p class="user">
                                <img src={cosmo_logo} alt="Cosmo">
                                Cosmo
                            </p>
                        {:else}
                            <a class="user" href="/@{item.to === $address ? item.from : item.to}">
                                <img src="https://static.cosmo.fans/uploads/images/img_profile_gallag@3x.png" alt="User">
                                {#if item.to === $address}
                                    {item.from.slice(0, 6)}...{item.from.slice(-4)}
                                {:else}
                                    {item.to.slice(0, 6)}...{item.to.slice(-4)}
                                {/if}
                            </a>
                        {/if}
                    </div>
                </div>
            {/each}
        {/if}
        {#if total && items}
            {#each { length: Math.min(5, total - items.length) } as _, i}
                <div class="tradePlaceholder" use:viewport={i} class:halfPlaceholder={Math.min(5, total - items.length) === i + 1}></div>
            {/each}
        {:else if total !== 0}
            {#each { length: limit } as _, i}
                <div class="tradePlaceholder" class:halfPlaceholder={limit === i + 1}></div>
            {/each}
        {/if}
    </div>
</div>

<style>
    .layout {
        display: flex;
        flex-direction: column;
        gap: 40px;
        padding: 20px;
        padding-top: 40px;
        align-items: center;
    }

    .header {
        width: 100%;
        display: flex;
        gap: 20px;
        align-items: center;
    }

    .total {
        font-weight: normal;
        font-size: 24px;
        flex: 1;
    }

    .items {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .trade {
        display: flex;
        align-items: center;
        gap: 20px;
        padding: 10px 20px;
        border-radius: 10px;
        background-color: var(--item-color);
        text-align: center;
        flex-wrap: wrap;
    }

    .trade button {
        min-width: 175px;
        text-decoration: underline;
        background: none;
        padding: 0;
        border: none;
        color: inherit;
        font-size: inherit;
    }

    .type, .date {
        min-width: 65px;
    }

    .chip {
        padding: 5px 10px;
        border-radius: 5px;
        background-color: var(--accent-color);
        font-size: 14px;
        font-weight: bold;
    }

    .chip.to {
        background-color: #94E5FE;
        color: #0A6673;
    }

    .chip.from {
        background-color: #c3fe94;
        color: #1d510b;
    }

    .chip.mint {
        background-color: #fe94c6;
        color: #730a37;
    }

    .user {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 5px;
        color: inherit;
    }

    .user img {
        height: 25px;
        border-radius: 25px;
    }

    .details {
        display: contents;
    }

    .tradePlaceholder,
    .totalPlaceholder {
        background-color: var(--placeholder-color);
    }

    .tradePlaceholder {
        width: 100%;
        max-width: 530px;
        margin: 0 auto;
        height: 60px;
        border-radius: 10px;
    }

    .totalPlaceholder {
        width: 120px;
        height: 30px;
        border-radius: 5px;
        margin-right: auto;
    }

    .halfPlaceholder {
        background: linear-gradient(to bottom, var(--placeholder-color), var(--placeholder-transparent));
    }

    .trade, .total {
        animation: fade-in .1s;
    }

    @media only screen and (max-width: 630px) {
        .items {
            width: 100%;
        }

        .trade {
            width: 100%;
            display: grid;
            grid-template-columns: auto 1fr 1fr 1fr;
            gap: 10px;
        }

        .date {
            grid-row: span 2;
        }

        .trade button {
            grid-column: span 3;
        }

        .details {
            grid-column: span 3;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
        }

        .user {
            flex: initial;
        }

        .type {
            min-width: 0;
        }

        .tradePlaceholder {
            width: 100%;
            height: 75px;
        }
    }

    @media only screen and (max-width: 600px) {
        .layout {
            padding: 10px;
            padding-top: 20px;
            gap: 20px;
        }

        .header {
            padding: 0 10px;
        }
    }
</style>