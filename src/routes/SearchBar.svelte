<script lang="ts">
    import { Cosmo } from '$lib/data/apis';
    import { isAddress } from 'ethers';
	import { goto } from '$app/navigation';
    import search_icon from '$lib/assets/icons/search.svg';
	import { page } from '$app/stores';
	import { t } from 'svelte-i18n';

    let query: string;
    let timeout: number;
    let value: string;
    let results: Cosmo.User[] | undefined;
    let searchBar: HTMLDivElement;

    function input() {
        if (timeout)
            window.clearTimeout(timeout);
        timeout = window.setTimeout(search, 300);
        results = undefined;
    }

    async function search() {
        if (!value)
            return;

        query = value;

        if (value && isAddress(value)) {
            const res = await fetch(`${Cosmo.URL}/user/v1/by-address/${query}`);
            const data = await res.json();
            if (value === query)
                results = data;
        } else if (value.length >= 4 && value.length <= 15) {
            const res = await fetch(`${Cosmo.URL}/user/v1/search?query=${query}`);
            const data = await res.json();
            if (value === query)
                results = data.results;
        }
    }

    function keypress(event: KeyboardEvent) {
        if (event.key === 'Enter' && value) {
            goto(`/@${value}`);
            results = undefined;
            value = '';
        }
    }

    function mouseup(e: MouseEvent) {
        if (!searchBar.contains(e.target as Node)) {
            results = undefined;
            value = '';
        }
    }

    let _page: typeof $page;
    $: if (_page !== $page) {
        results = undefined;
        value = '';
        _page = $page;
    }
</script>

<svelte:window on:mouseup={mouseup}/>

<div class="searchBar" bind:this={searchBar}>
    <img src={search_icon} alt="Search">
    <input type="text" placeholder={$t('users.search.placeholder')} on:input={input} on:keypress={keypress} bind:value>
    {#if results && results.length}
        <div class="results">
            {#each results as result}
                <a href="/@{result.nickname}">
                    <img src="https://static.cosmo.fans/uploads/images/img_profile_gallag@3x.png" alt="{result.nickname}">
                    {result.nickname}
                </a>
            {/each}
        </div>
    {/if}
</div>

<style>
    .searchBar {
        height: 30px;
        border-radius: 10px;
        background-color: var(--item-secondary);
        border-radius: 10px;
        margin-left: auto;
        display: flex;
        gap: 5px;
        padding: 5px 10px;
        position: relative;
    }

    .searchBar:has(input:focus) {
        border: 1px var(--accent-color) solid;
        padding: 4px 9px;
        box-shadow: var(--box-shadow);
    }

    input {
        height: 100%;
        flex: 1;
        background: none;
        padding: 0;
        border: 0;
        outline: none;
        font-size: 16px;
        min-width: 220px;
        color: inherit;
    }

    ::placeholder {
        color: inherit;
        opacity: .75;
    }

    .results {
        position: absolute;
        top: calc(100% + 5px);
        left: 0;
        width: 100%;
        background-color: var(--item-secondary);
        color: #FFFFFF;
        border-radius: 10px;
        box-shadow: var(--box-shadow);
        animation: fade-in 0.1s;
        max-height: 350px;
        overflow-y: auto;
        padding: 5px 0;
    }

    .results a {
        display: flex;
        width: 100%;
        color: inherit;
        padding: 10px 15px;
        align-items: center;
        gap: 10px;
        transition: background-color 0.1s;
    }

    .results a:hover {
        background-color: #0000001A;
    }

    .results a img {
        height: 25px;
    }
</style>