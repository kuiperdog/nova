<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { Cosmo, Subsquid } from '$lib/data/apis';
    import { page } from '$app/stores';
    import { pushState } from '$app/navigation';
    import QrScanner from 'qr-scanner';

    export let scanning = true;
    let video: HTMLVideoElement;
    let qrScanner: QrScanner;
    let scanned = false;

    onMount(() => {
        qrScanner = new QrScanner(video, async (res) => {
            if (res.data.startsWith('https://link.cosmo.fans/mint') && !scanned) {
                scanned = true;
                const lookup = await fetch(`${Cosmo.URL}/objekt/v1/by-serial/${res.data.slice(-11)}`);
                const data = await lookup.json();
                if (data && data.objekt) {
                    const id = data.objekt.collectionId.toLowerCase().replaceAll(' ', '-');
                    pushState(`/objekt/${id}/${data.objekt.objektNo}`, {
                        collection: {
                            id: id,
                            artists: data.objekt.artists,
                            member: data.objekt.member,
                            number: data.objekt.collectionNo,
                            front: data.objekt.frontImage,
                            back: data.objekt.backImage,
                            thumbnail: data.objekt.thumbnailImage,
                            season: data.objekt.season,
                            class: data.objekt.class,
                            textColor: data.objekt.textColor,
                            backgroundColor: data.objekt.backgroundColor,
                            timestamp: 1
                        },
                        objekt: { ...Subsquid.Objekt, serial: data.objekt.objektNo },
                        previous: $page.url.href
                    });
                    scanning = false;
                }
            }
        }, {
            highlightScanRegion: true,
            highlightCodeOutline: true
        });

        qrScanner.start();
    });

    onDestroy(() => {
        qrScanner.stop();
    });
</script>

<div class="blur">
    <button on:click={() => scanning = false}></button>
    <div class="popup">
        <!-- svelte-ignore a11y-media-has-caption -->
        <video bind:this={video}></video>
    </div>
</div>

<style>
    .blur {
        position: fixed;
        top: calc(50px + env(safe-area-inset-top));
        left: 0;
        width: 100%;
        height: calc(100% - 50px - env(safe-area-inset-top));
        z-index: var(--nav-z-index);
        backdrop-filter: blur(var(--blur-radius));
        -webkit-backdrop-filter: blur(var(--blur-radius));
        display: flex;
        justify-content: center;
        align-items: center;
    }

    button {
        background: none;
        padding: 0;
        border: none;
        width: 100%;
        height: 100%;
        position: absolute;
        cursor: pointer;
        z-index: -1;
    }

    .popup {
        max-width: 100%;
        max-height: 50%;
        aspect-ratio: 1;
        margin: 20px;
        padding: 20px;
        border-radius: 20px;
        background-color: var(--item-color);
        box-shadow: var(--box-shadow);
    }

    video {
        height: 100%;
        width: 100%;
        object-fit: cover;
        border-radius: 10px;
    }
</style>