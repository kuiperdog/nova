<script lang="ts">
    import nova_logo from '$lib/assets/images/logo.svg';
    import ArtistSelector from './ArtistSelector.svelte';
    import { Cosmo } from '$lib/data/apis';

    const version = __VERSION__;

    let selected: Cosmo.Artist | undefined;
    let _selected: Cosmo.Artist | undefined;

    $: if (selected && _selected !== selected) {
        _selected = selected;
        window.localStorage.setItem('defaultArtist', selected.name);
    }
</script>

<div class="settings">
    <div class="setting">
        <b>Default Artist:</b>
        <ArtistSelector bind:selected/>
    </div>
    <img class="logo" src={nova_logo} alt="Nova">
    <p>
        Nova v{version} by <a href="https://twitter.com/kuiperdog">Kuiper</a>
    </p>
    <p>
        <a href="https://github.com/kuiperdog/nova">Source Code</a>
        |
        <a href="https://patreon.com/kuiperdog">Donate</a>
        |
        <a href="https://github.com/kuiperdog/nova/issues">Bug Tracker</a>
    </p>
    <p class="disclaimer">Nova is not created by, endorsed by, or affiliated with Modhaus Inc.</p>
</div>

<style>
    .settings {
        height: 100%;
        margin-left: auto;
        width: 300px;
        background-color: var(--background-semitransparent);
        box-shadow: var(--box-shadow);
        backdrop-filter: blur(calc(var(--blur-radius) * 2));
        -webkit-backdrop-filter: blur(calc(var(--blur-radius) * 2));
        padding: 20px;
        display: flex;
        flex-direction: column;
        gap: 20px;
        text-align: center;
        align-items: center;
        animation: slide 0.5s;
    }

    .logo {
        margin-top: auto;
        width: 100px;
    }

    a {
        color: inherit;
    }

    .setting {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    @keyframes slide {
        0% {
            transform: translateX(100%);
        }
        100% {
            transform: translateX(0%);
        }
    }
</style>