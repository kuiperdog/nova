<script lang="ts">
    import { Cosmo } from '$lib/data/apis';

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
        <b>History</b>
        <p>8 gravities</p>
    </div>
    {#if gravities}
        {#each gravities as gravity}
            <div class="gravity">
                <img src={gravity.bannerImageUrl} alt={gravity.title}>
                <a class="title" href="/gravity/{gravity.artist}/{gravity.id}">
                    { gravity.title }
                </a>
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
        overflow: scroll;
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
        border-radius: 10px;
    }
</style>