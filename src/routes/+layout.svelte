<script lang="ts">
    import '$lib/assets/styles/base.css';
    import { tabs } from '$lib/data/tabs';
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';
    import logo from '$lib/assets/images/logo.svg';
    import nav_expand_icon from '$lib/assets/icons/nav_expand.svg';

    let innerWidth: number;
    let navExpanded = false;
</script>

<svelte:window bind:innerWidth/>

<nav class:expanded={navExpanded}>
    <img src={logo} class="logo" alt="Nova logo">
    {#if innerWidth > 650}
        {#each tabs as tab}
            <a href={tab.path} class:active={RegExp(tab.matches).test($page.url.pathname)}>{ tab.title }</a>
        {/each}
    {:else}
        {@const currentTab = tabs.find(tab => RegExp(tab.matches).test($page.url.pathname))}
        <button on:click={() => navExpanded = !navExpanded}>
            { currentTab?.title || 'Tabs' }
            <img src={nav_expand_icon} class="expandIcon" alt="Expand">
        </button>
        <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
        <div class="tabDropdown" on:click={() => navExpanded = false} on:keyup={(e) => { if (e.key === "Escape") navExpanded = false }} role="navigation">
            <div class="tabDropdownLayout">
                {#each tabs.filter(tab => tab !== currentTab) as tab}
                    <button on:click={() => { goto(tab.path); navExpanded = false; }}>
                        { tab.title }
                    </button>
                {/each}
            </div>
        </div>
    {/if}
</nav>

<main>
    <slot/>
</main>

<style>
    nav, .tabDropdown {
        position: fixed;
        z-index: var(--nav-z-index);
        width: 100%;
    }

    nav, .tabDropdownLayout {
        font-family: 'Halvar Breitschrift';
        font-weight: bold;
        font-size: 24px;
        background-color: var(--background-semitransparent);
        backdrop-filter: blur(var(--blur-radius));
        -webkit-backdrop-filter: blur(var(--blur-radius));
    }

    nav {
        top: 0;
        height: 50px;
        padding: 0 20px;
        display: flex;
        align-items: center;
        gap: 24px;
    }

    main {
        padding-top: 50px;
        max-width: 1120px;
        width: 100%;
        margin: 0 auto;
        height: 100%;
    }

    a {
        text-decoration: none;
        transition: color .2s, border-color .2s;
        border-bottom: 2px solid #00000000;
        margin-top: -2px;
        line-height: 50px;
        color: #49565E;
    }

    a.active {
        color: #FFFFFF;
        border-bottom-color: #FFFFFF;
    }

    .logo {
        width: 60px
    }

    button {
        background: none;
        border: none;
        padding: 0;
        margin: 0 auto;
        cursor: pointer;
        font-family: inherit;
        font-size: inherit;
        font-weight: inherit;
        color: #FFFFFF;
        display: flex;
    }

    .expandIcon {
        transition: transform 0.25s ease-in-out;
    }

    .expanded .expandIcon {
        transform: rotate(180deg);
    }

    .tabDropdown {
        top: 50px;
        left: 0;
        height: 0;
        overflow-y: hidden;
        transition: height 0.25s ease-in-out;
    }

    .expanded .tabDropdown {
        height: calc(100vh - 50px);
    }

    .tabDropdownLayout {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 12px;
        padding: 12px;
        padding-top: 0;
    }
</style>
