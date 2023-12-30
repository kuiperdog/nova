<script lang="ts">
    export let data: any;
</script>

<div class="widget">
    <div class="header">
        <b>Objekt Supply</b>
        {#if data && data.data}
            <p>{ data.data.objektsConnection.totalCount.toLocaleString('en-US') } total</p>
        {:else}
            <div class="textPlaceholder" style:width="100px"></div>
        {/if}
    </div>
    <hr>
    <div class="graph">
        {#each { length: 7 } as _, i}
            <div class="day">
                {#if data && data.data}
                {@const max = Object.keys(data.data).filter(k => k.startsWith('day'))
                    .reduce((acc, d) => data.data[d].totalCount > acc ? data.data[d].totalCount : acc, 0)}
                    <div class="bar" style:height="{data.data[`day${i + 1}`].totalCount / max * 100}px"
                        title="{data.data[`day${i + 1}`].totalCount.toLocaleString('en-US')} Objekts"></div>
                    <p>{ new Intl.DateTimeFormat(undefined, {weekday: 'short'}).format(new Date().setDate(new Date().getDate() + i + 1)) }</p>
                {:else}
                    <div class="barPlaceholder" style:height="{Math.random() * 90 + 10}px"></div>
                    <div class="textPlaceholder" style:width="25px"></div>
                {/if}
            </div>
        {/each}
    </div>
    <hr>
    <div class="details">
        <div>
            <b>This Week:</b>
            {#if data && data.data}
                <p>
                    { Object.keys(data.data).filter(k => k.startsWith('day')).reduce((acc, d) => acc + data.data[d].totalCount, 0).toLocaleString('en-US') }
                </p>
            {:else}
                <div class="textPlaceholder" style:width="50px"></div>
            {/if}
        </div>
        <hr>
        <div>
            <b>Today:</b>
            {#if data && data.data}
                <p>
                    { data.data.day7.totalCount.toLocaleString('en-US') }
                </p>
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
        background-color: var(--accent-color);
        width: 20px;
        border-radius: 5px;
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

    .barPlaceholder {
        background-color: var(--item-secondary);
        border-radius: 5px;
        width: 20px;
    }
</style>