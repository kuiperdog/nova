<script lang="ts">
    import { t, number } from 'svelte-i18n';

    export let data: any;

    $: max = data && data.data ? Object.keys(data.data).filter(k => k.startsWith('day'))
        .reduce((acc, d) => data.data[d].totalCount > acc ? data.data[d].totalCount : acc, 0) : 0;
</script>

<div class="widget">
    <div class="header">
        <b>{$t('widget.objektsupply.title')}</b>
    </div>
    <hr>
    <div class="graph">
        {#each { length: 7 } as _, i}
            <div class="day">
                <div class="bar" class:loaded={data && data.data} title={data && data.data ? data.data[`day${i + 1}`].totalCount.toLocaleString('en-US') : ''}
                    style:height="{data && data.data ? data.data[`day${i + 1}`].totalCount / max * 100 : 10}px"></div>
                <p>{ new Intl.DateTimeFormat(undefined, {weekday: 'short'}).format(new Date().setDate(new Date().getDate() + i + 1)) }</p>
            </div>
        {/each}
    </div>
    <hr>
    <div class="details">
        <div>
            <b>{$t('widget.objektsupply.weekly_supply')}</b>
            {#if data && data.data}
                <p>{$number(Object.keys(data.data).filter(k => k.startsWith('day')).reduce((acc, d) => acc + data.data[d].totalCount, 0))}</p>
            {:else}
                <div class="textPlaceholder" style:width="50px"></div>
            {/if}
        </div>
        <hr>
        <div>
            <b>{$t('widget.objektsupply.daily_supply')}</b>
            {#if data && data.data}
                <p>{$number(data.data.day7.totalCount)}</p>
            {:else}
                <div class="textPlaceholder" style:width="40px"></div>
            {/if}
        </div>
    </div>
</div>

<style>
    .widget {
        min-width: 310px;
    }

    .graph {
        width: 100%;
        display: flex;
        justify-content: space-evenly;
        align-items: end;
        height: 160px;
    }

    .day {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
        padding: 15px 0;
    }

    .bar {
        background-color: var(--item-secondary);
        width: 20px;
        border-radius: 5px;
        transition: background-color .25s, height .25s;
    }

    .bar.loaded {
        background-color: var(--accent-color);
    }

    .day p {
        opacity: 0.5;
    }

    .details {
        width: 100%;
        display: flex;
        gap: 10px;
    }

    .details > div {
        flex: auto;
        display: flex;
        padding: 20px 15px;
    }

    .details b {
        flex: 1;
    }

    .details hr {
        margin: 0 -10px;
    }

    .details p {
        animation: fade-in .1s;
    }
</style>