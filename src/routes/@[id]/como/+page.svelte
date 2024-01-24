<script lang="ts">
    import { Subsquid, Cosmo } from "$lib/data/apis";
    import ArtistSelector from "$lib/components/common/ArtistSelector.svelte";
    import { getAssets } from "$lib/data/assets";
    import { type Writable } from "svelte/store";
    import { getContext } from "svelte";
    import { t } from 'svelte-i18n';

    let artist: Cosmo.Artist;
    let selected: Cosmo.Artist | undefined;
    let ranking: number | undefined;
    let days: number[] | undefined;

    const balances: Writable<Subsquid.Como[]> = getContext("como");
    const month = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();

    $: {
        if (selected && artist !== selected && $balances) {
            artist = selected;
            ranking = days = undefined;
            const contract = artist.contracts.Como.toLowerCase();
            const balance = $balances.find(b => b.contract === contract);

            fetch(Subsquid.URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    query: `
                        query {
                            comosConnection(orderBy: id_ASC, where: {contract_eq: "${contract}", AND: {balance_gt: "${balance?.balance}", OR: {balance_eq: "${balance?.balance}", id_gt: "${balance?.id}"}}}) {
                                totalCount
                            }
                            objekts(orderBy: id_ASC, limit: 9999, where: {owner_eq: "${balance?.owner}", collection_isNull: false, collection: {class_eq: "Special", artists_containsAll: "${artist.name}"}}) {
                                minted
                            }
                        }
                    `
                })
            }).then(async (res) => {
                const data = await res.json();
                ranking = data.data.comosConnection.totalCount + 1;

                let como = Array(month).fill(0);
                for (const objekt of data.data.objekts)
                    como[Math.min(new Date(Number(objekt.minted)).getDate() - 1, month)]++;
                days = como;
            });
        }
    }

</script>

<div class="layout">
    <div class="header">
        <ArtistSelector bind:selected/>
        {#if artist}
            <img class="comoImg" src={getAssets(artist).como} alt="COMO">
        {/if}
        <p class="como">COMO</p>
        <div class="ranking">
            <b>{$t('profile.como.rank')}</b>
            {#if ranking}
                <p>#{ranking.toLocaleString('en-US')}</p>
            {:else}
                <div class="placeholder"></div>
            {/if}
        </div>
    </div>
    <table>
        <tr>
            {#each { length: 7 } as _, i}
                <th>{new Intl.DateTimeFormat(undefined, { weekday: 'short' }).format(new Date(2024, 0, i + 1))}</th>
            {/each}
        </tr>
        {#each { length: 6 } as _, week}
            {@const offset = new Date(new Date().getFullYear(), new Date().getMonth(), 1).getDay() - 1}
            {#if week * 7 < month + offset}
                <tr>
                    {#each { length: 7 } as _, day}
                        <td class:today={new Date().getDate() === week * 7 + day + 1 - offset}>
                            <div class="day">
                                {#if day >= offset && week * 7 + day + 1 - offset <= month}
                                    <p class="number">{ week * 7 + day + 1 - offset }</p>
                                    {#if days}
                                        {#if days[week * 7 + day - offset]}
                                            <p>+{days[week * 7 + day - offset]}</p>
                                        {/if}
                                    {:else}
                                        <div class="placeholder"></div>
                                    {/if}
                                {/if}
                            </div>
                        </td>
                    {/each}
                </tr>
            {/if}
        {/each}
    </table>
</div>

<style>
    .layout {
        padding: 40px 20px;
    }

    .header {
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .como {
        font-size: 20px;
    }

    .comoImg {
        margin-right: -5px;
        width: 20px;
        height: 20px;
    }

    .ranking {
        margin-left: auto;
        background-color: var(--item-color);
        padding: 10px 20px;
        border-radius: 10px;
        display: flex;
        gap: 10px;
    }

    table {
        margin-top: 20px;
        width: 100%;
        border-spacing: 0;
        table-layout: fixed;
    }

    td, th {
        border: solid 1px var(--button-border);
        padding: 0;
        overflow: hidden;
    }

    th {
        background-color: var(--item-secondary);
        padding: 5px;
    }

    .day {
        width: 100%;
        height: 100%;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 80px;
        background-color: var(--item-color);
    }

    .day .number {
        position: absolute;
        top: 5px;
        left: 5px;
        color: #717F8D;
    }

    .today {
        border-color: var(--accent-color);
    }

    .today .number {
        color: var(--accent-color);
    }

    th:first-of-type {
        border-top-left-radius: 10px;
    }

    th:last-of-type {
        border-top-right-radius: 10px;
    }

    tr:last-of-type td:first-of-type {
        border-bottom-left-radius: 10px;
    }

    tr:last-of-type td:last-of-type {
        border-bottom-right-radius: 10px;
    }

    .placeholder {
        background-color: var(--item-secondary);
        border-radius: 5px;
        height: 20px;
    }

    .day .placeholder {
        width: 30px;
    }

    .ranking .placeholder {
        width: 50px;
    }
    
    .day p, .ranking p {
        animation: fade-in .1s;
    }

    @media only screen and (max-width: 450px) {
        .layout {
            padding: 20px 10px;
        }

        table {
            font-size: 14px;
        }
    }
</style>