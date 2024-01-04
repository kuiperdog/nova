<script lang="ts">
    import { Cosmo } from "$lib/data/apis";
    import { getAssets } from "$lib/data/assets";
    
    export let selected: Cosmo.Artist | undefined = undefined;
    
    let artists: Cosmo.Artist[];
    Cosmo.artists().then(a => {
        artists = a;

        if (!selected)
            selected = a[0];
    });

    function mouseup(e: MouseEvent) {
        if (!container.contains(e.target as Node))
            open = false;
    }

    let open = false;
    let container: HTMLDivElement;
</script>

<svelte:window on:mouseup={mouseup}/>

<div class="container" bind:this={container}>
    <button class="selected" class:open={open} on:click={() => open = !open}>
        {#if selected}
            <img class="logo" class:tripleS={selected.name === 'tripleS'} src={getAssets(selected).logo} alt={selected.title}>
        {:else}
            <div class="placeholder"></div>
        {/if}
    </button>
    {#if open}
        <div class="popup">
            {#each artists.filter(a => a !== selected) as artist}
                <button on:click={() => { selected = artist; open = false; }}>
                    <img class="logo" class:tripleS={artist.name === 'tripleS'} src={getAssets(artist).logo} alt={artist.title}>
                </button>
            {/each}
        </div>
    {/if}
</div>

<style>
    .container {
        position: relative;
    }

    button {
        background: none;
        border: none;
        display: flex;
        padding: 10px;
        transition: background-color 0.25s;
    }

    .selected:hover, .selected:active, .selected.open {
        background-color: var(--item-color);
    }

    .selected {
        border-bottom: 2px solid var(--accent-color);
    }

    .logo {
        height: 12.5px;
    }

    .logo.tripleS {
        height: 20px;
        margin: -3.75px 0;
    }

    .placeholder {
        background-color: var(--placeholder-color);
        border-radius: 5px;
        height: 12.5px;
        width: 85px;
    }

    .popup {
        position: absolute;
        top: 100%;
        left: 50%;
        transform: translateX(-50%);
        background-color: var(--placeholder-color);
        border-radius: 5px;
        box-shadow: var(--box-shadow);
        animation: fade-in 0.25s;
        min-width: 100%;
    }

    .popup button {
        margin: 0 auto;
    }
</style>