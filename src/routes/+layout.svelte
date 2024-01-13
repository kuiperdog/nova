<script lang="ts">
    import '$lib/assets/styles/base.css';
    import { tabs } from '$lib/data/tabs';
    import { page } from '$app/stores';
    import { goto, onNavigate } from '$app/navigation';
    import logo from '$lib/assets/images/logo.svg';
    import nav_expand_icon from '$lib/assets/icons/nav_expand.svg';
    import find_icon from '$lib/assets/icons/find.svg';
    import settings_icon from '$lib/assets/icons/settings.svg';
    import SearchBar from '$lib/components/common/SearchBar.svelte';
	import ObjektModal from '$lib/components/common/ObjektModal.svelte';
    import Settings from '$lib/components/common/Settings.svelte';

    let innerWidth: number;
    let navExpanded = false;
    let searchExpanded = false;
    let settingsOpen = false;
    
    onNavigate(() => {
        searchExpanded = settingsOpen = false;
    });
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
        <button class="link current" on:click={() => { navExpanded = !navExpanded; searchExpanded = settingsOpen = false; }}>
            { currentTab?.title || 'Tabs' }
            <img src={nav_expand_icon} class="expandIcon" alt="Expand">
        </button>
    {/if}

    {#if innerWidth >= 900}
        <SearchBar/>
    {:else}
        <button class="iconBtn search" class:active={searchExpanded} on:click={() => { searchExpanded = !searchExpanded; navExpanded = settingsOpen = false; }}>
            <img src={find_icon} alt="Search">
        </button>
    {/if}
    <button class="iconBtn" class:active={settingsOpen} on:click={() => { settingsOpen = !settingsOpen; navExpanded = searchExpanded = false; }}>
        <img src={settings_icon} alt="Settings">
    </button>
</nav>

<main>
    {#if $page.state.collection}
        <ObjektModal collection={$page.state.collection} objekt={$page.state.objekt}/>
    {/if}
    
    <slot/>
</main>

{#if settingsOpen}
    <div class="blur">
        <button class="close" on:click={() => settingsOpen = false}/>
        <Settings/>
    </div>
{/if}

{#if innerWidth < 650 && navExpanded}
{@const currentTab = tabs.find(tab => RegExp(tab.matches).test($page.url.pathname))}
    <div class="blur">
        <button class="close" on:click={() => navExpanded = false}/>
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
        <button class="close" on:click={() => searchExpanded = false}/>
        <div class="dropdown" style:padding="20px">
            <SearchBar/>
        </div>
    </div>
{/if}

<style>
    nav {
        position: fixed;
        top: 0;
        height: calc(50px + env(safe-area-inset-top));
        width: 100%;
        padding: 0 20px;
        padding-top: env(safe-area-inset-top);
        z-index: var(--nav-z-index);
        background-color: var(--background-semitransparent);
        backdrop-filter: blur(var(--blur-radius));
        -webkit-backdrop-filter: blur(var(--blur-radius));
        display: flex;
        align-items: center;
        gap: 25px;
    }

    main {
        padding-top: calc(50px + env(safe-area-inset-top));
        max-width: 1120px;
        width: 100%;
        margin: 0 auto;
        height: 100%;
    }

    .blur {
        position: fixed;
        top: calc(50px + env(safe-area-inset-top));
        left: 0;
        width: 100%;
        height: calc(100% - 50px - env(safe-area-inset-top));
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
        border-bottom: 2px solid #00000000;
        margin-bottom: -2px;
        transition: border-color .2s;
    }

    .iconBtn.active {
        border-bottom-color: #FFFFFF;
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
</style>
