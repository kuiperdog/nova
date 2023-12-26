<script lang="ts">
    import ObjektPreview from './ObjektPreview.svelte';
    import { onDestroy, type ComponentProps } from 'svelte';
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';
    import { Cosmo } from '$lib/data/apis';

    const batchSize = 30;

    let artists: Cosmo.Artist[];
    Cosmo.artists().then(a => artists = a);

    export let profile = false;
    export let total: number | null;
    export let load: (offset: number, length: number) => Promise<ComponentProps<ObjektPreview>[]>;
    let items: ComponentProps<ObjektPreview>[] = [];

    $: {
        if (artists && total === null) {
            items = [];
            load(0, batchSize).then(res => items = res);
        }
    }

    let loading = false;
    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !loading) {
            loading = true;
            load(items.length, batchSize).then(res => {
                items = [...items, ...res];
                loading = false;
            });
        }
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

    let objektWidth: number;
    let gridWidth: number;
    $: columns = Math.floor(gridWidth / objektWidth);

    let visible: {[key: string]: boolean} = {};
    const toggle = (key: string) => visible[key] = !visible[key];
    function setFilter(key: string, value: string, hideFilter: boolean = true) {
        const url = new URL($page.url);
        url.searchParams.set(key, value);
        goto(url);
        if (hideFilter)
            visible[key + 'Filter'] = false;
    }
</script>

<div class="layout" class:loading={total === null}>
    <div class="header">
        {#if total === null}
            <div class="skeleton totalSkeleton"></div>
        {:else}
            <h2 class="total">{total.toLocaleString('en-US')} items</h2>
        {/if}
    </div>
    <div class={gridWidth > (profile ? 1040 : 830) ? 'filtersContainer' : 'filtersPopup'}>
        <div class="filters">
            {#if !artists}
                {#each { length: profile ? 6 : 5 } as _}
                    <div class="skeleton filterSkeleton"></div>
                {/each}
            {:else}
                <div class="filter">
                    {#if $page.url.searchParams.has('artist')}
                        <p class="filterLabel">Artist</p>
                    {/if}
                    <button on:click={() => toggle(`artistFilter`)}>
                        {#if !$page.url.searchParams.has('artist')}
                            Artist
                        {:else if artists.find(a => a.name === $page.url.searchParams.get('artist'))}
                            {@const artist = artists.find(a => a.name === $page.url.searchParams.get('artist'))}
                            <img src={artist?.logoImageUrl} alt={artist?.title}>
                            { artist?.title }
                        {:else if artists.find(a => a.members.find(m => m.name === $page.url.searchParams.get('artist')))}
                            {@const member = artists.flatMap(a => a.members).find(m => m.name === $page.url.searchParams.get('artist'))}
                            <img src={member?.profileImageUrl} alt={member?.name}>
                            { member?.name }
                        {:else if Cosmo.unit($page.url.searchParams.get('artist') ?? '')}
                            { $page.url.searchParams.get('artist') }
                        {/if}
                    </button>
                    {#if visible[`artistFilter`]}
                        <div class="filterContent">
                            {#if $page.url.searchParams.has('artist')}
                                {@const artist = artists.find(a => a.name === $page.url.searchParams.get('artist'))
                                    || artists.find(a => a.members.find(m => m.name === $page.url.searchParams.get('artist')))
                                    || artists.find(a => a.members.find(m => m.name === (Cosmo.unit($page.url.searchParams.get('artist') ?? '') ?? [])[0]))}
                                <p>Units</p>
                                <div class="artistUnits">
                                    {#each artist ? artist.members.reduce((acc, m) => new Set([...acc, ...(m.units || [])]), new Set()) : [] as unit}
                                        {#if $page.url.searchParams.get('artist') !== unit}
                                            <button class="unitButton" on:click={() => setFilter('artist', String(unit))}>{ unit }</button>
                                        {/if}
                                    {/each}
                                </div>
                                <p>Members</p>
                                {#each artist ? artist.members : [] as member}
                                    <button on:click={() => setFilter('artist', member.name)}>
                                        <img src={member.profileImageUrl} alt={member.name}>
                                        { member.name }
                                    </button>
                                {/each}
                            {:else}
                                <div class="artistsGrid">
                                    {#each artists as artist}
                                        <button class="artistsGridItem" on:click={() => setFilter('artist', artist.name, false)}>
                                            <img src={artist.logoImageUrl} alt={artist.title}>
                                            <p>{ artist.title }</p>
                                        </button>
                                    {/each}
                                </div>
                            {/if}
                        </div>
                    {/if}
                </div>
                {#each [
                    {name: 'season', title: 'Season', options: ['Atom01', 'Binary01', 'Cream01']},
                    {name: 'class', title: 'Class', options: ['First', 'Special', 'Welcome', 'Double', 'Zero']},
                    {name: 'type', title: 'Type', options: ['Physical', 'Digital']}
                ] as filter}
                    <div class="filter">
                        {#if $page.url.searchParams.has(filter.name)}
                            <p class="filterLabel">{ filter.title }</p>
                        {/if}
                        <button on:click={() => toggle(`${filter.name}Filter`)}>
                            { $page.url.searchParams.has(filter.name) ? $page.url.searchParams.get(filter.name) : filter.title }
                        </button>
                        {#if visible[`${filter.name}Filter`]}
                            <div class="filterContent">
                                {#each filter.options as option}
                                    {#if !$page.url.searchParams.has(filter.name) || $page.url.searchParams.get(filter.name) !== option}
                                        <button on:click={() => setFilter(filter.name, option)}>{ option }</button>
                                    {/if}
                                {/each}
                            </div>
                        {/if}
                    </div>
                {/each}
                <div class="filter">
                    {#if $page.url.searchParams.has('number') || $page.url.searchParams.has('minNumber') || $page.url.searchParams.has('maxNumber')}
                        <p class="filterLabel">Number</p>
                    {/if}
                    <button>
                        {#if $page.url.searchParams.has('number')}
                            { $page.url.searchParams.get('number') }
                        {:else if $page.url.searchParams.has('minNumber') && $page.url.searchParams.has('maxNumber')}
                            { $page.url.searchParams.get('minNumber')} - {$page.url.searchParams.get('maxNumber') }
                        {:else if $page.url.searchParams.has('minNumber')}
                            Below { $page.url.searchParams.get('minNumber') }
                        {:else if $page.url.searchParams.has('maxNumber')}
                            Above { $page.url.searchParams.has('maxNumber') }
                        {:else}
                            Number
                        {/if}
                    </button>
                </div>
                <div class="filter">
                    {#if $page.url.searchParams.has('minSerial') || $page.url.searchParams.has('maxSerial')}
                        <p class="filterLabel">Serial</p>
                    {/if}
                    <button>
                        {#if $page.url.searchParams.has('minSerial')}
                            Above { Number($page.url.searchParams.get('minSerial')).toLocaleString() }
                        {:else if $page.url.searchParams.has('maxSerial')}
                            Below { Number($page.url.searchParams.get('maxSerial')).toLocaleString() }
                        {:else}
                            Serial
                        {/if}
                    </button>
                </div>
            {/if}
        </div>
    </div>
    <div class="grid" bind:clientWidth={gridWidth}>
        {#if total === null}
            {#each { length: batchSize } as _}
                <div class="skeleton objektSkeleton" bind:clientWidth={objektWidth} style="height: {objektWidth * 487/314}px;"></div>
            {/each}
        {:else}
            {#each items as item}
                <ObjektPreview {...item}/>
            {/each}
            {#each { length: Math.min((items.length % columns || columns) + columns, total - items.length) } as _, i}
                <div class="{i - (items.length % columns || columns) >= 0 ? 'halfSkeleton' : 'skeleton'} objektSkeleton"
                    bind:clientWidth={objektWidth} use:viewport={i} style="height: {objektWidth * 487/314}px;"></div>
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
        width: 100%;
    }

    .header {
        display: flex;
    }

    .total {
        font-weight: normal;
        font-size: 24px;
    }

    .totalSkeleton {
        border-radius: 5px;
        width: 125px;
        height: 29px;
    }

    .grid {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        gap: 20px;
    }

    .loading {
        overflow-y: hidden;
        height: 100%;
    }

    .filtersContainer .filters {
        display: flex;
        justify-content: space-between;
        gap: 20px;
    }

    .filtersContainer .filter {
        flex: 1;
    }

    .filter > button {
        width: 100%;
        min-width: 150px;
        height: 40px;
        border-radius: 10px;
        border: none;
        font-size: 16px;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 5px;
    }

    .filter button img {
        height: 25px;
        border-radius: 12.5px;
    }

    .filter {
        position: relative;
    }

    .filterSkeleton {
        border-radius: 10px;
        height: 40px;
        width: 100%;
    }

    .filterLabel {
        position: absolute;
        bottom: calc(100% + 5px);
    }

    .filterContent {
        width: 100%;
        position: absolute;
        top: 100%;
        z-index: var(--dropdown-z-index);
        display: flex;
        flex-direction: column;
    }

    .artistsGrid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        padding: 5px;
        gap: 5px;
    }

    .artistsGridItem {
        aspect-ratio: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        gap: 5px;
        border: none;
        border-radius: 10px;
        cursor: pointer;
    }

    .artistUnits {
        display: flex;
        flex-wrap: wrap;
        gap: 5px;
    }

    .unitButton {

    }

    .skeleton {
        background-color: var(--placeholder-color);
    }

    .halfSkeleton {
        background: linear-gradient(to bottom, var(--placeholder-color), var(--placeholder-transparent));
    }

    .objektSkeleton {
        border-radius: 5% / calc(5% * 314/487);
    }

    .total, .filters, .filterLabel {
        animation: fade-in 0.5s;
    }

    @keyframes fade-in {
        0% {
            opacity: 0;
        }

        100% {
            opacity: 1;
        }
    }

    @media only screen and (max-width: 900px) {
        .grid {
            grid-template-columns: repeat(4, 1fr);
        }
    }

    @media only screen and (max-width: 700px) {
        .grid {
            grid-template-columns: repeat(3, 1fr);
        }
    }

    @media only screen and (max-width: 450px) {
        .layout, .grid {
            gap: 10px;
        }

        .layout {
            padding: 10px;
        }
    }
</style>