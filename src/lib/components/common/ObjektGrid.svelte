<script lang="ts">
    import ObjektPreview from './ObjektPreview.svelte';
    import { onDestroy, type ComponentProps } from 'svelte';
    import { browser } from '$app/environment';

    const batchSize = 30;

    export let total: number | null;
    export let load: (offset: number, length: number) => Promise<ComponentProps<ObjektPreview>[]>;
    let items: ComponentProps<ObjektPreview>[] = [];

    $: if (total === null) load(0, batchSize).then(res => items = res);

    let loading = false;
    let observer: IntersectionObserver;

    if (browser) {
        observer = new IntersectionObserver((entries) => {
            console.log(entries);
            if (entries[0].isIntersecting && !loading) {
                loading = true;
                load(items.length, batchSize).then(res => {
                    items = [...items, ...res];
                    loading = false;
                });
            }
        });
        
        onDestroy(observer.disconnect);
    }

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
    $: columns = Math.floor(gridWidth / objektWidth);
</script>


{#if total === null}
    <div class="layout loading">
        <div class="grid">
            {#each { length: batchSize } as _}
                <div class="skeleton objektSkeleton" bind:clientWidth={objektWidth} style="height: {objektWidth * 487/314}px;"></div>
            {/each}
        </div>
    </div>
{:else}
    <div class="layout">
        <div class="grid" bind:clientWidth={gridWidth}>
            {#each items as item}
                <ObjektPreview {...item}/>
            {/each}
            {#each { length: Math.min((items.length % columns || columns) + columns, total - items.length) } as _, i}
                <div class="{i - (items.length % columns || columns) >= 0 ? 'halfSkeleton' : 'skeleton'} objektSkeleton"
                    bind:clientWidth={objektWidth} use:viewport={i} style="height: {objektWidth * 487/314}px;"></div>
            {/each}
        </div>
    </div>
{/if}

<style>
    .layout {
        display: flex;
        flex-direction: column;
        gap: 20px;
        padding: 20px;
        width: 100%;
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

    .skeleton {
        background-color: var(--placeholder-color);
    }

    .halfSkeleton {
        background: linear-gradient(to bottom, var(--placeholder-color), var(--placeholder-transparent));
    }

    .objektSkeleton {
        border-radius: 5% / calc(5% * 314/487);
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

    @media only screen and (max-width: 450px) {
        .layout, .grid {
            gap: 10px;
        }

        .layout {
            padding: 10px;
        }
    }
</style>