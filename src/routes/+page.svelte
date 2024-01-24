<script lang="ts">
    import "$lib/assets/styles/widget.css";
    import SystemStatus from "$lib/components/widgets/SystemStatus.svelte";
    import ObjektSupply from "$lib/components/widgets/ObjektSupply.svelte";
    import Mints from "$lib/components/widgets/Mints.svelte";
    import Transfers from "$lib/components/widgets/Transfers.svelte";
    import { Subsquid } from "$lib/data/apis";
    import { ZeroAddress } from "ethers";

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
                    transfersConnection(orderBy: id_DESC, first: 5, where: {from_not_eq: "${ZeroAddress}", to_not_eq: "${ZeroAddress}"}) {
                        edges {
                            node {
                                ${Object.keys(Subsquid.Transfer).join('\n')}
                                objekt {
                                    ${Object.keys(Subsquid.Objekt).join('\n')}
                                    collection {
                                        ${Object.keys(Subsquid.Collection).join('\n')}
                                    }
                                }
                            }
                        }
                    }
                    mints: objektsConnection(orderBy: minted_DESC, where: {collection_isNull: false}, first: 10) {
                        edges {
                            node {
                                ${Object.keys(Subsquid.Objekt).join('\n')}
                                collection {
                                    ${Object.keys(Subsquid.Collection).join('\n')}
                                }
                            }
                        }
                    }
                    ${dateQueries}
                }
            `
        })
    }).then(async res => {
        data = await res.json();
    });

    let windowWidth: number;
</script>

<svelte:window bind:innerWidth={windowWidth}/>

<div class="layout">
    <SystemStatus {data}/>
    {#if windowWidth > 750}
        <Mints {data}/>
        <ObjektSupply {data}/>
    {:else}
        <ObjektSupply {data}/>
        <Mints {data}/>
    {/if}
    <Transfers {data}/>
</div>

<style>
    .layout {
        margin: 40px 20px;
        column-count: 3;
        column-gap: 20px;
    }

    @media only screen and (max-width: 1110px) {
        .layout {
            column-count: 2;
        }
    }

    @media only screen and (max-width: 750px) {
        .layout {
            column-count: 1;
        }
    }

    @media only screen and (max-width: 390px) {
        .layout {
            margin: 20px 10px;
            gap: 10px;
        }
    }
</style>