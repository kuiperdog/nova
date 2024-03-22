<script lang="ts">
    import '$lib/assets/styles/base.css';
    import '$lib/i18n';
    import { page } from '$app/stores';
    import { t, locale } from 'svelte-i18n';
    import { onNavigate } from '$app/navigation';
    import SearchBar from './SearchBar.svelte';
    import ObjektModal from '$lib/components/common/ObjektModal.svelte';
    import logo from '$lib/assets/images/logo.svg';
    import icon_menu from '$lib/assets/icons/menu.svg';
    import icon_home from '$lib/assets/icons/home.svg';
    import icon_objekts from '$lib/assets/icons/objekts.svg';
    import icon_gravity from '$lib/assets/icons/gravity.svg';
    import icon_users from '$lib/assets/icons/users.svg';

    const version = __VERSION__;
    export const tabs = [
        {
            title: 'Home',
            icon: icon_home,
            path: '/',
            matches: '^\/$'
        },
        {
            title: 'Objekts',
            icon: icon_objekts,
            path: '/objekt',
            matches: '^\/objekt'
        },
        {
            title: 'Gravity',
            icon: icon_gravity,
            path: '/gravity',
            matches: '^\/gravity'
        },
        {
            title: 'Users',
            icon: icon_users,
            path: '/users',
            matches: '^(\/users|\/@.+)$'
        }
    ];

    let expanded = false;
    onNavigate(() => { expanded = false });
    $: currentTab = tabs.find(tab => RegExp(tab.matches).test($page.url.pathname));

    function toggleLanguage() {
        let lang = 'kr';
        if ($locale && $locale.startsWith('kr'))
            lang = 'en';

        window.localStorage.setItem('language', lang);
        $locale = lang;
    }
</script>

<svelte:head>
    {#key $page.route}
        <title>Nova{currentTab ? ` | ${currentTab.title}` : ''}</title>
    {/key}
</svelte:head>

<div class="topbar" class:expanded={expanded}>
    <button class="expand" on:click={() => expanded = !expanded}>
        <img alt="Expand" src={icon_menu}>
        {#if !currentTab || currentTab === tabs[0]}
            <img class="logo" src={logo} alt="Nova">
        {:else}
            {currentTab.title}
        {/if}
    </button>
    <div class="liveIndicator">
        <div class="dot"></div>
        <b>LIVE</b>
    </div>
</div>

<div class="sidebar" class:expanded={expanded}>
    <div class="header">
        <img class="logo" src={logo} alt="Nova">
        <div class="liveIndicator">
            <div class="dot"></div>
            <b>LIVE</b>
        </div>
        <div class="searchbar">
            <SearchBar />
        </div>
    </div>
    <hr>
    {#each tabs as tab}
        <a class="tab" class:active={RegExp(tab.matches).test($page.url.pathname)} href={tab.path}>
            <img src={tab.icon} alt={tab.title}>
            { tab.title }
        </a>
    {/each}
    <hr>
    <div class="placeholder"></div>
    <hr>
    <div class="footer">
        <div>
            <p>{$t('settings.language')}</p>
            <button class="language" on:click={() => toggleLanguage()}>
                {#if $locale && $locale.startsWith('kr')}
                    🇰🇷 한국어
                {:else}
                    🇬🇧 English
                {/if}
            </button>
        </div>
        <div class="version">
            <p>Version {version}</p>
            <a href="https://github.com/kuiperdog/nova">{$t('settings.source')}</a>
        </div>
        <p>{$t('settings.disclaimer')}</p>
    </div>
</div>

<main>
    {#if $page.state.collection}
        <ObjektModal collection={$page.state.collection} objekt={$page.state.objekt}/>
    {/if}
    {#if expanded}
        <button class="close" on:click={() => expanded = false} />
    {/if}
    <slot />
</main>

<style>
    .topbar, .sidebar {
        position: fixed;
        top: 0;
        left: 0;
    }

    .topbar {
        display: none;
        height: calc(50px + env(safe-area-inset-top));
        width: 100%;
        z-index: 1;
        background-color: var(--background-semitransparent);
        backdrop-filter: blur(var(--blur-radius));
        -webkit-backdrop-filter: blur(var(--blur-radius));
        padding: 0 25px;
        padding-top: env(safe-area-inset-top);
        gap: 12.5px;
        align-items: center;
        justify-content: space-between;
    }

    .topbar.expanded {
        opacity: 0;
        transition: opacity .5s;
    }

    .expand {
        background: none;
        border: none;
        padding: 0;
        display: flex;
        gap: 12.5px;
        align-items: center;
        color: inherit;
    }

    .expand, .tab {
        font-size: 24px;
        font-family: 'Halvar Breitschrift';
        font-weight: bold;
    }

    .sidebar {
        height: 100%;
        width: 300px;
        background-color: var(--item-color);
        display: flex;
        flex-direction: column;
        border-radius: 0 25px 25px 0;
    }

    .sidebar.expanded {
        display: flex;
        position: fixed;
        z-index: 5;
        animation: slide-in .5s;
    }

    .header, .footer {
        padding: 25px;
    }

    .header {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        gap: 12.5px;
    }

    .logo {
        width: 60px;
    }

    .liveIndicator {
        display: flex;
        align-items: center;
        gap: 5px;
        color: var(--item-secondary);
        transition: color .25s;
    }

    .liveIndicator .dot {
        height: 15px;
        width: 15px;
        border-radius: 7.5px;
        background-color: var(--item-secondary);
        transition: color .25s;
    }

    .liveIndicator.active {
        color: #FFFFFF;
    }

    .liveIndicator.active .dot {
        background-color: #C8141D;
        animation: pulse 1s infinite;
    }

    .searchbar {
        flex-basis: 100%;
        width: 100%;
    }

    .tab {
        height: 40px;
        margin: 5px;
        padding: 0 20px;
        text-decoration: none;
        border-radius: 10px;
        display: flex;
        align-items: center;
        gap: 5px;
        transition: background-color .25s;
    }

    .tab.active, .tab:hover {
        background-color: #232A30;
    }

    .tab img {
        height: 24px;
    }

    .placeholder {
        flex: 1;
    }

    .footer div {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .language {
        background-color: var(--item-secondary);
        padding: 5px 10px;
        border-radius: 5px;
        border: 0;
        color: inherit;
        font-weight: bold;
    }

    .version {
        margin: 12.5px 0;
    }

    .close {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 4;
        background-color: var(--background-semitransparent);
        border: 0;
        padding: 0;
        backdrop-filter: blur(var(--blur-radius));
        -webkit-backdrop-filter: blur(var(--blur-radius));
        animation: fade-in .5s;
    }

    main {
        margin-left: 300px;
    }

    hr {
        border-color: #232A30;
    }

    a {
        color: #FFFFFF;
    }

    @media only screen and (max-width: 600px) {
        .topbar {
            display: flex;
        }

        .sidebar, .sidebar .logo, .sidebar .liveIndicator {
            display: none;
        }

        main {
            margin-left: 0;
            margin-top: calc(50px + env(safe-area-inset-top));
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

    @keyframes slide-in {
        0% {
            transform: translateX(-100%);
        }

        100% {
            transform: translateX(0%);
        }
    }

    @keyframes fade-in {
        0% {
            opacity: 0;
        }

        100% {
            opacity: 1;
        }
    }
</style>
