<script lang="ts">
    import { Subsquid } from '$lib/data/apis';
    import { page } from '$app/stores';
    import { pushState } from '$app/navigation';
    import { t } from 'svelte-i18n';

    export let data: any;
</script>

<div class="widget">
    <div class="header">
        <b>{$t('widget.mints.title')}</b>
        <p>{$t('widget.mints.subtitle')}</p>
    </div>
    <hr>
    {#if data && data.data}
        {#each data.data.mints.edges as edge, i}
        {@const objektAge = (Date.now() - edge.node.minted) / 1000}
            <div class="objekt">
                <button on:click={() => pushState(`/objekt/${edge.node.collection.id}/${edge.node.serial}`, 
                    { collection: edge.node.collection, objekt: edge.node, previous: $page.url.href })}>
                    { Subsquid.formatObjekt(edge.node.collection, edge.node) }
                </button>
                {#if objektAge < 60}
                    <p>{$t('general.seconds_past', { values: { seconds: Math.floor(objektAge) } })}</p>
                {:else if objektAge < 3600}
                    <p>{$t('general.minutes_past', { values: { minutes: Math.floor(objektAge / 60) } })}</p>
                {:else}
                    <p>{$t('general.hours_past', { values: { hours: Math.floor(objektAge / 3600) } })}</p>
                {/if}
            </div>
            {#if i < 9}
                <hr>
            {/if}
        {/each}
    {:else}
        {#each { length: 10 } as _, i}
            <div class="objekt">
                <div class="textPlaceholder objektPlaceholder" style:width="140px"></div>
                <div class="textPlaceholder" style:width="100px"></div>
            </div>
            {#if i < 9}
                <hr>
            {/if}
        {/each}
    {/if}
</div>

<style>
    .widget {
        min-width: 310px;
    }
    
    .objekt {
        padding: 15px;
        display: flex;
        align-items: center;
    }

    .objekt button {
        text-decoration: underline;
        background: none;
        padding: 0;
        border: none;
        color: inherit;
        font-size: inherit;
    }

    .objekt button,
    .objektPlaceholder {
        margin-right: auto;
    }

    .objekt button, .objekt p {
        animation: fade-in .1s;
    }
</style>