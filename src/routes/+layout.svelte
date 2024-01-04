<script lang="ts">
    import '$lib/assets/styles/base.css';
    import { tabs } from '$lib/data/tabs';
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';
    import logo from '$lib/assets/images/logo.svg';
    import nav_expand_icon from '$lib/assets/icons/nav_expand.svg';
    import find_icon from '$lib/assets/icons/find.svg';
    import SearchBar from '$lib/components/common/SearchBar.svelte';
	import ObjektModal from '$lib/components/common/ObjektModal.svelte';

    let innerWidth: number;
    let navExpanded = false;
    let searchExpanded = false;
</script>

<svelte:window bind:innerWidth/>

<svelte:head>
    {#key $page.route}
        <title>Nova | {(tabs.find(tab => RegExp(tab.matches).test($page.url.pathname)) || tabs[0]).title}</title>
    {/key}
</svelte:head>

<nav class:expanded={navExpanded}>
    <img src={logo} class="logo" alt="Nova logo">

    {#if innerWidth >= 650}
        {#each tabs as tab}
            <a class="link" href={tab.path} class:active={RegExp(tab.matches).test($page.url.pathname)}>{ tab.title }</a>
        {/each}
    {:else}
        {@const currentTab = tabs.find(tab => RegExp(tab.matches).test($page.url.pathname))}
        <button class="link current" on:click={() => { navExpanded = !navExpanded; searchExpanded = false; }}>
            { currentTab?.title || 'Tabs' }
            <img src={nav_expand_icon} class="expandIcon" alt="Expand">
        </button>
    {/if}

    {#if innerWidth >= 900}
        <SearchBar/>
    {:else}
        <button class="iconBtn search" class:active={searchExpanded} on:click={() => { searchExpanded = !searchExpanded; navExpanded = false; }}>
            <img src={find_icon} alt="Search">
        </button>
    {/if}
</nav>

<main>
    {#if $page.state.collection}
        <ObjektModal collection={$page.state.collection} objekt={$page.state.objekt}/>
    {/if}
    
    <slot/>
</main>

{#if innerWidth < 650 && navExpanded}
{@const currentTab = tabs.find(tab => RegExp(tab.matches).test($page.url.pathname))}
    <div class="blur">
        <button class="close" on:keyup={(e) => { if (e.key === "Escape") navExpanded = false }} on:click={() => navExpanded = false}/>
        <div class="dropdown">
            {#each tabs.filter(tab => tab !== currentTab) as tab}
                <button class="link" on:click={() => { goto(tab.path); navExpanded = false; }}>
                    { tab.title }
                </button>
            {/each}
        </div>
    </div>
{/if}


{#if innerWidth < 900 && searchExpanded}
    <div class="blur searchDropdown">
        <button class="close" on:keyup={(e) => { if (e.key === "Escape") searchExpanded = false }} on:click={() => searchExpanded = false}/>
        <div class="dropdown" style:padding="20px">
            <SearchBar/>
        </div>
    </div>
{/if}

<style>
    nav {
        position: fixed;
        top: 0;
        height: 50px;
        width: 100%;
        padding: 0 20px;
        z-index: var(--nav-z-index);
        background-color: var(--background-semitransparent);
        backdrop-filter: blur(var(--blur-radius));
        -webkit-backdrop-filter: blur(var(--blur-radius));
        display: flex;
        align-items: center;
        gap: 25px;
    }

    main {
        padding-top: 50px;
        max-width: 1120px;
        width: 100%;
        margin: 0 auto;
        height: 100%;
    }

    .blur {
        position: fixed;
        top: 50px;
        left: 0;
        width: 100%;
        height: calc(100% - 50px);
        z-index: var(--nav-z-index);
        backdrop-filter: blur(5px);
        -webkit-backdrop-filter: blur(5px);
        display: flex;
        justify-content: center;
        animation: 0.25s fade-in;
    }

    .close {
        width: 100%;
        height: 100%;
        background: none;
        border: none;
        padding: 0;
        position: absolute;
        z-index: -1;
    }

    .link {
        font-family: 'Halvar Breitschrift';
        font-weight: bold;
        font-size: 24px;
    }

    a.link {
        text-decoration: none;
        transition: color .2s, border-color .2s;
        border-bottom: 2px solid #00000000;
        margin-top: -2px;
        line-height: 50px;
        color: #49565E;
    }

    a.link.active {
        color: #FFFFFF;
        border-bottom-color: #FFFFFF;
    }

    .logo {
        width: 60px
    }

    button.link {
        background: none;
        border: none;
        padding: 0;
        margin: 0 auto;
        cursor: pointer;
        color: #FFFFFF;
        display: flex;
    }

    .expandIcon {
        margin-right: -5px;
        transition: transform 0.25s ease-in-out;
    }

    .expanded .expandIcon {
        transform: rotate(180deg);
    }

    .dropdown {
        width: 100%;
        height: max-content;
        background-color: var(--background-semitransparent);
    }

    .dropdown .link {
        height: 50px;
        line-height: 50px;
    }

    .iconBtn {
        background: none;
        border: 0;
        padding: 0;
    }

    .iconBtn img {
        width: 25px;
    }

    .iconBtn.search {
        margin-left: auto;
        margin-right: -15px;
    }

    :has(.current) .iconBtn.search {
        margin-left: 0;
    }

    .iconBtn.search.active {
        border-bottom: 2px solid #FFFFFF;
        margin-bottom: -2px;
    }
</style>
