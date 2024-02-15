<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { Cosmo, Subsquid } from '$lib/data/apis';
    import { page } from '$app/stores';
    import { pushState } from '$app/navigation';
    import { lastScan } from '$lib/data/limits';
    import QrScanner from 'qr-scanner';
    import status_warning_icon from '$lib/assets/icons/status_warning.svg';
    import { t } from 'svelte-i18n';

    export let scanning: boolean;
    let video: HTMLVideoElement;
    let qrScanner: QrScanner;
    let scanned = false;
    let timeout = 0;
    let interval: number;

    function startTimeout(length: number) {
        timeout = length;
        interval = window.setInterval(() => {
            timeout--;
            if (!timeout) {
                qrScanner.start();
                clearInterval(interval);
            }
        }, 1000);
    }

    onMount(() => {
        qrScanner = new QrScanner(video, async (res) => {
            if (res.data.startsWith('https://link.cosmo.fans/mint') && !scanned) {
                scanned = true;
                
                let lookup;
                try {
                    lookup = await fetch(`${Cosmo.URL}/objekt/v1/by-serial/${res.data.slice(-11)}`);
                    $lastScan = Date.now();
                } catch {
                    startTimeout(10);
                    qrScanner.stop();
                    $lastScan = Date.now();
                    scanned = false;
                    return;
                }

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

        if ($lastScan && $lastScan > Date.now() - 5000)
            startTimeout(Math.ceil((Date.now() - $lastScan) / 1000));
        else
            qrScanner.start();
    });

    onDestroy(() => {
        clearInterval(interval);
        qrScanner.stop();
    });
</script>

<div class="blur">
    <button on:click={() => scanning = false}></button>
    <div class="popup">
        {#if timeout}
            <div class="notice">
                <img src={status_warning_icon} alt="Warning">
                <p>{$t('objekt.scantimeout', { values: { seconds: timeout } })}</p>
            </div>
        {/if}
        <!-- svelte-ignore a11y-media-has-caption -->
        <video bind:this={video} class:hidden={timeout}></video>
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
        width: 100%;
        aspect-ratio: 1;
        margin: 20px;
        padding: 20px;
        border-radius: 20px;
        background-color: var(--item-color);
        box-shadow: var(--box-shadow);
    }

    .notice {
        height: 100%;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        gap: 10px;
        font-size: 20px;
        text-align: center;
    }

    .notice img {
        height: 30px;
    }

    video {
        height: 100%;
        width: 100%;
        object-fit: cover;
        border-radius: 10px;
    }

    video.hidden {
        opacity: 0;
        width: 0px;
        height: 0px;
        transform: scaleX(-1);
    }
</style>