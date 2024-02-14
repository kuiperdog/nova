<script lang="ts">
    import { Cosmo } from '$lib/data/apis';
    import { t } from 'svelte-i18n';

    export let artist: Cosmo.Artist;
    export let gravities: Cosmo.Gravity[] | undefined = undefined;

    if (!gravities) {
        fetch(`${Cosmo.URL}/gravity/v3/${artist.name}`).then(async (res) => {
            const data = await res.json() as { 
                upcoming: Cosmo.Gravity[];
                ongoing: Cosmo.Gravity[];
                past: Cosmo.Gravity[];
            };

            gravities = [ ...data.upcoming, ...data.ongoing, ...data.past ];
        });
    }
</script>

<div class="history">
    <div class="header">
        <b>{$t('gravity.history.title')}</b>
        {#if gravities}
            <p>{$t('gravity.history.subtitle', { values: { count: gravities.length } })}</p>
        {:else}
            <div class="placeholder" style:Width="80px"></div>
        {/if}
    </div>
    {#if gravities}
        {#each gravities as gravity}
            <div class="gravity">
                <img src={gravity.bannerImageUrl} alt={gravity.title}>
                {#if gravity.polls.length > 1}
                    <p>{ gravity.title }</p>
                {:else}
                    <a class="title" href="/gravity/{gravity.artist}/{gravity.id}">
                        { gravity.title }
                    </a>
                {/if}
            </div>
            {#if gravity.polls.length > 1}
                {#each gravity.polls.sort((a, b) => Date.parse(a.startDate) - Date.parse(b.startDate)) as poll}
                    <div class="poll">
                        <a href="/gravity/{gravity.artist}/{gravity.id}/{poll.id}">{ poll.title }</a>
                        <p>{ new Date(poll.startDate).toLocaleDateString() }</p>
                    </div>
                {/each}
            {/if}
            <hr>
        {/each}
    {:else}
        {#each { length: 5 } as _, i}
            <div class="gravity">
                <div class="placeholder imgPlaceholder"></div>
                <div class="placeholder" style:width="calc(100% - 60px)"></div>
            </div>
            <hr>
        {/each}
    {/if}
</div>

<style>
    .history {
        width: 100%;
        background-color: var(--item-color);
        border-radius: 20px;
        overflow: auto;
        flex: 1;
        max-height: 50vh;
        display: flex;
        flex-direction: column;
    }
    
    .header {
        display: flex;
        padding: 10px 20px;
        justify-content: space-between;
        position: sticky;
        top: 0;
        background-color: inherit;
        border-bottom: 1px solid var(--button-border);
    }

    .gravity {
        display: flex;
        padding: 20px;
        gap: 10px;
        align-items: center;
    }
    
    .gravity .title {
        max-width: 185px;
        color: inherit;
        font-size: 16px;
    }

    .gravity img {
        height: 50px;
        width: 50px;
        border-radius: 10px;
    }

    .poll {
        margin: 5px 20px;
        padding: 5px 10px;
        display: flex;
        justify-content: space-between;
        background-color: var(--item-secondary);
        border-radius: 5px;
    }

    .poll a {
        color: inherit;
    }

    .placeholder {
        border-radius: 5px;
        height: 20px;
        background-color: var(--item-secondary);
    }

    .imgPlaceholder {
        border-radius: 10px;
        height: 50px;
        width: 50px;
    }
</style>