<script lang="ts">
    import StatusWidget from "$lib/components/widgets/StatusWidget.svelte";
    import ObjektSupply from "$lib/components/widgets/ObjektSupply.svelte";
    import { Subsquid } from "$lib/data/apis";

    let data: any;

    let dateQueries = '';
    for (let i = 0; i < 7; i++) {
        const date = new Date();
        date.setHours(0, 0, 0, 0);
        date.setDate(date.getDate() - (6 - i));
        const gte = date.getTime();
        date.setDate(date.getDate() + 1);
        const lte = date.getTime();

        dateQueries += `
            day${i + 1}: objektsConnection(orderBy: id_ASC, where: {minted_gte: "${gte}", minted_lte: "${lte}"}) {
                totalCount
            }
        `;
    }

    fetch(Subsquid.URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            query: `
                query {
                    squidStatus {
                        height
                    }
                    objektsConnection(orderBy: id_ASC) {
                        totalCount
                    }
                    ${dateQueries}
                }
            `
        })
    }).then(async res => {
        data = await res.json();
    });

</script>

<div class="layout">
    <StatusWidget {data}/>
    <ObjektSupply {data}/>
</div>

<style>
    .layout {
        display: flex;
        margin: 40px 20px;
        gap: 20px;
        flex-wrap: wrap;
        align-items: flex-start;
    }

    @media only screen and (max-width: 390px) {
        .layout {
            margin: 20px 10px;
            gap: 10px;
        }
    }
</style>