<script lang="ts">
    import ObjektPreview from './ObjektPreview.svelte';
    import { onDestroy, type ComponentProps } from 'svelte';
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';
    import { Cosmo } from '$lib/data/apis';
    import clear_icon from '$lib/assets/icons/clear.svg';
    import sort_icon from '$lib/assets/icons/sort.svg';
    import filter_icon from '$lib/assets/icons/filter.svg';

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
    let minNumber: number | undefined;
    let maxNumber: number | undefined;
    let _number: number | undefined;
    let minSerial: number | undefined;
    let maxSerial: number | undefined;
    let openFilter: HTMLDivElement;
    $: columns = Math.floor(gridWidth / objektWidth);

    const sorts = [
        { name: 'Newest', value: '' }, 
        { name: 'Oldest', value: 'oldest' }, 
        { name: 'Number', value: 'number' },
        ...(profile ? [
            { name: 'Minted', value: 'minted' },
            { name: 'Serial', value: 'serial' }
        ] : [])
    ];

    let visible: {[key: string]: boolean} = {};
    const toggle = (key: string) => visible[key] = !visible[key];
    function setFilter(key: string, value: string, hideFilter: boolean = true) {
        const url = new URL($page.url);

        if (value)
            url.searchParams.set(key, value);
        else
            url.searchParams.delete(key);
        goto(url);

        if (hideFilter)
            visible[key + 'Filter'] = false;

        visible['artistUnits'] = false;
    }

    function clearFilters(name: string, filters: string[]) {
        const url = new URL($page.url);
        for (const filter of filters)
            url.searchParams.delete(filter);
        goto(url);

        if (name)
            visible[name + 'Filter'] = false;

        if (filters.includes('number'))
            _number = undefined;
        if (filters.includes('minNumber') || filters.includes('maxNumber'))
            minNumber = maxNumber = undefined;
        if (filters.includes('minSerial') || filters.includes('maxSerial'))
            minSerial = maxSerial = undefined;
    }

    function mouseup(e: MouseEvent) {
        for (const item of Object.keys(visible)) {
            if (item.endsWith('Filter') && (!openFilter || (!openFilter.contains(e.target as Node)) && !(e.target as HTMLElement).id.startsWith(item)))
                visible[item] = false;
        }

        if (visible['filtersPopup'] && (e.target as HTMLElement).id === 'filtersContainer')
            visible['filtersPopup'] = false;
    }
</script>

<svelte:window on:mouseup={mouseup}/>

<div class="layout" class:loading={total === null}>
    <div class="header">
        {#if total === null}
            <div class="skeleton totalSkeleton"></div>
        {:else}
            <h2 class="total">{total.toLocaleString('en-US')} items</h2>
        {/if}
        <div class="sortButton">
            <button on:click={() => toggle('sortFilter')} id="sortFilterBtn" class:active={visible['sortFilter'] || $page.url.searchParams.has('sort')}>
                {#if $page.url.searchParams.has('sort')}
                    <u>{ sorts.find(s => s.value === $page.url.searchParams.get('sort'))?.name }</u>
                {:else}
                    Sort
                {/if}
                <img src={sort_icon} alt="Sort">
            </button>
            {#if visible['sortFilter']}
                <div class="filterContent sortFilter" bind:this={openFilter} id="sortFilter">
                    {#each sorts as sort, index}
                        {#if ($page.url.searchParams.get('sort') || '') !== sort.value}
                            <button on:click={() => setFilter('sort', sort.value)}>{ sort.name }</button>
                            {#if index < (profile ? 4 : 2)}
                                <hr>
                            {/if}
                        {/if}
                    {/each}
                </div>
            {/if}
        </div>
        <button class="filterButton" on:click={() => visible['filtersPopup'] = true} class:active={[...$page.url.searchParams.keys()].filter(k => k !== 'sort').length}>
            Filter
            <img src={filter_icon} alt="Filter">
        </button>
    </div>
    <div class={gridWidth > (profile ? 1040 : 830) ? 'filtersContainer' : 'filtersPopup'} class:showPopup={visible['filtersPopup']} id="filtersContainer">
        <div class="filters">
            {#if !artists}
                {#each { length: profile ? 6 : 5 } as _}
                    <div class="skeleton filterSkeleton"></div>
                {/each}
            {:else}
                <div class="filter">
                    {#if $page.url.searchParams.has('artist')}
                        <p class="filterLabel">Artist</p>
                        <button class="clearFilter" on:click={() => setFilter('artist', '')}>
                            <img src={clear_icon} alt="Clear">
                            Clear
                        </button>
                    {/if}
                    <button on:click={() => toggle(`artistFilter`)} id="artistFilterBtn">
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
                        <div class="filterContent" bind:this={openFilter} id="artistFilter">
                            {#if $page.url.searchParams.has('artist')}
                                {@const artist = artists.find(a => a.name === $page.url.searchParams.get('artist'))
                                    || artists.find(a => a.members.find(m => m.name === $page.url.searchParams.get('artist')))
                                    || artists.find(a => a.members.find(m => m.name === (Cosmo.unit($page.url.searchParams.get('artist') ?? '') ?? [])[0]))}
                                {@const units = artist ? new Set(artist.members.reduce((acc, m) =>[...acc, ...(m.units ?? [])
                                    .filter(u => $page.url.searchParams.get('artist') !== u)], new Array()).sort()) : new Set()}
                                <div class="filterHeader">
                                    <button class:active={!visible['artistUnits']} on:click={() => visible['artistUnits'] = false}>Members</button>
                                    {#if units.size}
                                        <button class:active={visible['artistUnits']} on:click={() => visible['artistUnits'] = true}>Units</button>
                                    {/if}
                                </div>
                                <hr>
                                {#if visible['artistUnits']}
                                    {@const units = artist ? new Set(artist.members.reduce((acc, m) => [...acc, ...(m.units ?? [])], new Array()).sort()) : new Set()}
                                    {#each units as unit, index}
                                        <button class="unit" on:click={() => setFilter('artist', String(unit))}>{ unit }</button>
                                        {#if index < units.size - 1}
                                            <hr>
                                        {/if}
                                    {/each}
                                {:else}
                                    {#each artist ? artist.members : [] as member, index}
                                        <button class="artist" on:click={() => setFilter('artist', member.name)}>
                                            <img src={member.profileImageUrl} alt={member.name} class:activeArtist={$page.url.searchParams.get('artist') == member.name
                                                || (Cosmo.unit($page.url.searchParams.get('artist') ?? '') ?? []).includes(member.name)}>
                                            { member.name }
                                        </button>
                                        {#if artist && index < artist.members.length - 1}
                                            <hr>
                                        {/if}
                                    {/each}
                                {/if}
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
                    {name: 'type', title: 'Type', options: ['A', 'Z']}
                ] as filter}
                    <div class="filter">
                        {#if $page.url.searchParams.has(filter.name)}
                            <p class="filterLabel">{ filter.title }</p>
                            <button class="clearFilter" on:click={() => setFilter(filter.name, '')}>
                                <img src={clear_icon} alt="Clear">
                                Clear
                            </button>
                        {/if}
                        <button on:click={() => toggle(`${filter.name}Filter`)} id="{filter.name}FilterBtn">
                            { $page.url.searchParams.has(filter.name) ? $page.url.searchParams.get(filter.name) : filter.title }
                        </button>
                        {#if visible[`${filter.name}Filter`]}
                            <div class="filterContent" bind:this={openFilter} id="{filter.name}Filter">
                                {#each filter.options as option, index}
                                    {#if !$page.url.searchParams.has(filter.name) || $page.url.searchParams.get(filter.name) !== option}
                                        <button on:click={() => setFilter(filter.name, option)}>
                                            { option }
                                        </button>
                                        {#if index < filter.options.length - 1}
                                            <hr>
                                        {/if}
                                    {/if}
                                {/each}
                            </div>
                        {/if}
                    </div>
                {/each}
                <div class="filter">
                    {#if $page.url.searchParams.has('number') || $page.url.searchParams.has('minNumber') || $page.url.searchParams.has('maxNumber')}
                        <p class="filterLabel">Number</p>
                        <button class="clearFilter" on:click={() => clearFilters('number', ['number', 'minNumber', 'maxNumber'])}>
                            <img src={clear_icon} alt="Clear">
                            Clear
                        </button>
                    {/if}
                    <button on:click={() => toggle('numberFilter')} id="numberFilterBtn">
                        {#if $page.url.searchParams.has('number')}
                            { $page.url.searchParams.get('number') }
                        {:else if $page.url.searchParams.has('minNumber') && $page.url.searchParams.has('maxNumber')}
                            { $page.url.searchParams.get('minNumber')} - {$page.url.searchParams.get('maxNumber') }
                        {:else if $page.url.searchParams.has('minNumber')}
                            Above { $page.url.searchParams.get('minNumber') }
                        {:else if $page.url.searchParams.has('maxNumber')}
                            Below { $page.url.searchParams.has('maxNumber') }
                        {:else}
                            Number
                        {/if}
                    </button>
                    {#if visible['numberFilter']}
                        <div class="filterContent" bind:this={openFilter} id="numberFilter">
                            <div class="filterHeader">
                                <button class:active={!visible['exactNumber']} on:click={() => { visible['exactNumber'] = false; clearFilters('', ['number']) }}>
                                    Range
                                </button>
                                <button class:active={visible['exactNumber']} on:click={() => { visible['exactNumber'] = true; clearFilters('', ['minNumber', 'maxNumber']) }}>
                                    Exact
                                </button>
                            </div>
                            {#if visible['exactNumber']}
                                <div class="numberFilter">
                                    <input type="number" placeholder="000" size="3" min="0" maxlength="3" inputmode="numeric"
                                        bind:value={_number} on:blur={() => setFilter('number', _number ? _number.toString() : '', false)}>
                                </div>
                            {:else}
                                <div class="rangeFilter">
                                    <div>
                                        <p>From</p>
                                        <input type="number" placeholder="000" size="3" min="0" maxlength="3" inputmode="numeric"
                                            bind:value={minNumber} on:blur={() => setFilter('minNumber', minNumber ? minNumber.toString() : '', false)}>
                                    </div>
                                    <p>-</p>
                                    <div>
                                        <p>To</p>
                                        <input type="number" placeholder="999" size="3" min="0" maxlength="3" inputmode="numeric"
                                            bind:value={maxNumber} on:blur={() => setFilter('maxNumber', maxNumber ? maxNumber.toString() : '', false)}>
                                    </div>
                                </div>
                            {/if}
                        </div>
                    {/if}
                </div>
                {#if profile}
                    <div class="filter">
                        {#if $page.url.searchParams.has('minSerial') || $page.url.searchParams.has('maxSerial')}
                            <p class="filterLabel">Serial</p>
                            <button class="clearFilter" on:click={() => clearFilters('serial', ['minSerial', 'maxSerial'])}>
                                <img src={clear_icon} alt="Clear">
                                Clear
                            </button>
                        {/if}
                        <button on:click={() => toggle('serialFilter')} id="serialFilterBtn">
                            {#if $page.url.searchParams.has('minSerial')}
                                Above { Number($page.url.searchParams.get('minSerial')).toLocaleString() }
                            {:else if $page.url.searchParams.has('maxSerial')}
                                Below { Number($page.url.searchParams.get('maxSerial')).toLocaleString() }
                            {:else}
                                Serial
                            {/if}
                        </button>
                        {#if visible['serialFilter']}
                            <div class="filterContent" bind:this={openFilter} id="serialFilter">
                                <div class="filterHeader">
                                    <button class:active={visible['minSerial']} on:click={() => { visible['minSerial'] = true; clearFilters('', ['maxSerial']) }}>
                                        Minimum
                                    </button>
                                    <button class:active={!visible['minSerial']} on:click={() => { visible['minSerial'] = false; clearFilters('', ['minSerial']) }}>
                                        Maximum
                                    </button>
                                </div>
                                <div class="numberFilter">
                                    {#if visible['minSerial']}
                                        <input type="number" placeholder="00000" size="5" min="0" maxlength="5" inputmode="numeric"
                                            bind:value={minSerial} on:blur={() => setFilter('minSerial', minSerial ? minSerial.toString() : '', false)}>
                                    {:else}
                                        <input type="number" placeholder="99999" size="5" min="0" maxlength="5" inputmode="numeric"
                                            bind:value={maxSerial} on:blur={() => setFilter('maxSerial', maxSerial ? maxSerial.toString() : '', false)}>
                                    {/if}
                                </div>
                            </div>
                        {/if}
                    </div>
                {/if}
                <div class="doneBtn">
                    <button on:click={() => visible['filtersPopup'] = false}>
                        Done
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
        padding-top: 40px;
        width: 100%;
    }

    .header {
        display: flex;
        gap: 20px;
        align-items: center;
    }

    .total {
        font-weight: normal;
        font-size: 24px;
        flex: 1;
    }

    .totalSkeleton {
        border-radius: 5px;
        width: 125px;
        height: 29px;
        margin-right: auto;
    }

    .header button {
        background: none;
        border: none;
        font-size: 16px;
        padding: 0;
        color: var(--accent-color);
        display: flex;
        align-items: center;
        gap: 5px;
        padding: 5px;
        border-radius: 5px;
    }

    .header button img {
        height: 20px;
    }

    button.filterButton {
        display: none;
    }

    .header:has(~ .filtersPopup) .filterButton {
        display: flex;
    }

    .sortButton {
        position: relative;
    }

    .sortButton button.active,
    .filterButton.active {
        background-color: var(--accent-color);
        color: #fff;
    }

    .sortButton button.active img,
    .filterButton.active img {
        filter: brightness(500%);
    }

    .filterButton.active {
        text-decoration: underline;
    }

    .sortFilter {
        min-width: max-content;
        right: 50%;
        margin-top: 5px;
        transform: translateX(50%);
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

    .doneBtn {
        display: none;
    }

    .filtersPopup {
        position: fixed;
        top: 50px;
        left: 0;
        width: 100%;
        height: calc(100% - 50px);
        z-index: var(--nav-z-index);
        backdrop-filter: blur(5px);
        -webkit-backdrop-filter: blur(5px);
        display: none;
        justify-content: center;
        align-items: end;
    }

    .filtersPopup.showPopup {
        display: flex;
        animation: fade-in 0.1s;
    }

    .filtersPopup .filters {
        width: 100%;
        z-index: var(--dropdown-z-index);
        background-color: var(--item-color);
        box-shadow: var(--box-shadow);
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        border-radius: 20px 20px 0 0;
        padding: 40px 20px;
        gap: 40px 20px;
    }

    .filtersPopup .filters > * {
        flex: 1;
        min-width: max(calc((100% - 40px) / 5), 150px);
        max-width: calc((100% - 40px) / 3);
    }

    .filtersPopup .doneBtn {
        display: initial;
    }

    .filtersPopup .doneBtn button {
        width: 100%;
        min-width: 150px;
        background-color: var(--accent-color);
        color: #fff;
        border: none;
        border-radius: 10px;
        font-size: inherit;
        height: 40px;
        padding: 0 40px;
    }

    .doneBtn button:hover,
    .doneBtn button:active {
        filter: brightness(110%);
    }

    .filters button {
        transition: background-color 0.25s;
    }

    .filter button:not(.clearFilter):hover {
        background-color: var(--item-secondary);
    }

    .filter > button:not(.clearFilter) {
        width: 100%;
        min-width: 150px;
        height: 40px;
        font-size: 16px;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 5px;
        background-color: var(--item-color);
        color: inherit;
        border: 1px var(--button-border) solid;
        border-radius: 10px;
    }

    .filter button:not(.clearFilter) img {
        width: 25px;
        height: 25px;
        border-radius: 12.5px;
        background-color: var(--placeholder-color);
    }

    .filter input[type="number"] {
        width: 100%;
        margin: 0;
        padding: 0;
        border: none;
        outline: none;
        text-align: center;
        height: 25px;
        border-radius: 5px;
        background-color: var(--item-secondary);
        outline: 1px var(--button-border) solid;
        color: var(--text-color);
        font-size: inherit;
    }

    .filter {
        position: relative;
    }

    .filterSkeleton {
        border-radius: 10px;
        height: 40px;
        width: 100%;
    }

    .filterLabel,
    .clearFilter {
        position: absolute;
        bottom: calc(100% + 5px);
    }

    .clearFilter {
        background: none;
        border: none;
        padding: 0;
        color: #49565E;
        font-size: 14px;
        height: 20px;
        right: 0;
        text-decoration: underline;
        display: flex;
        align-items: center;
    }

    .clearFilter img {
        height: 18px;
    }

    .filterContent {
        width: 100%;
        position: absolute;
        top: 100%;
        z-index: var(--dropdown-z-index);
        display: flex;
        flex-direction: column;
        background-color: var(--item-color);
        border: 1px var(--button-border) solid;
        border-radius: 10px;
        max-height: 400px;
        overflow-y: scroll;
        animation: fade-in 0.1s;
    }

    .filtersPopup .filterContent {
        top: initial;
        bottom: 100%;
    }

    .filterContent button {
        background: none;
        color: inherit;
        border: none;
        padding: 10px;
        font-size: inherit;
    }

    .filterHeader {
        display: flex;
        height: 40px;
        padding: 0 10px;
        gap: 10px;
        position: sticky;
        top: 0;
        background-color: inherit;
    }

    .filterHeader button {
        height: inherit;
        font-size: 14px;
        flex: auto;
        font-weight: bold;
        padding: 0;
    }

    .filterHeader button.active {
        border-bottom: 2px var(--accent-color) solid;
        padding-top: 2px;
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
        background: none;
        color: inherit;
    }

    .artist {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 5px;
        justify-content: initial;
    }

    .activeArtist {
        border: 2px var(--accent-color) solid;
    }

    .rangeFilter {
        display: flex;
        align-items: center;
        gap: 5px;
        padding: 10px;
    }

    .rangeFilter > p {
        margin-top: 20px;
    }

    .rangeFilter div {
        flex: 1;
    }

    .rangeFilter div p {
        font-size: 12px;
        margin-bottom: 5px;
    }

    .numberFilter {
        padding: 10px;
        text-align: center;
    }

    .numberFilter input {
        max-width: 75%;
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

    .total, :not(.filtersPopup) > .filters, .filterLabel {
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

    @media only screen and (max-width: 530px) {
        .filtersPopup .filters > * {
            max-width: calc((100% - 40px) / 2);
        }
    }

    @media only screen and (max-width: 450px) {
        .layout, .grid {
            gap: 10px;
        }

        .layout {
            padding: 10px;
        }

        .header {
            margin: 10px;
        }
    }
</style>