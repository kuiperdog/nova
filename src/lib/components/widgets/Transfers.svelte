<script lang="ts">
    import { Subsquid, Cosmo } from '$lib/data/apis';
    import { page } from '$app/stores';
    import { pushState } from '$app/navigation';

    export let data: any;
    let users: Cosmo.User[];

    $: {
        if (data && data.data && !users) {
            const addresses = new Set(
                data.data.transfersConnection.edges.reduce((acc: string[], e: { node: Subsquid.Transfer }) => {
                    return [...acc, e.node.to, e.node.from];
                }, [])
            );

            fetch(`${Cosmo.URL}/user/v1/by-address/${Array.from(addresses).join(',')}`)
                .then(async (res) => users = await res.json());
        }
    }
</script>

<div class="widget">
    <div class="header">
        <b>Transfers</b>
        <p>Showing 5 latest</p>
    </div>
    <hr>
    {#if data && data.data && users}
        {#each data.data.transfersConnection.edges as edge, i}
        {@const objektAge = (Date.now() - edge.node.timestamp) / 1000}
        {@const from = users.find(u => u.address === edge.node.from)}
        {@const to = users.find(u => u.address === edge.node.to)}
            <div class="transfer">
                <div class="users">
                    <p>From</p>
                    <img class="profileImage" src="https://static.cosmo.fans/uploads/images/img_profile_gallag@3x.png" alt="To">
                    <p>{ from ? from.nickname : edge.node.from.slice(0, 6) + '...' + edge.node.from.slice(-4) }</p>
                    <div class="spacer"></div>
                    <p>To</p>
                    <img class="profileImage" src="https://static.cosmo.fans/uploads/images/img_profile_gallag@3x.png" alt="To">
                    <p>{ to ? to.nickname : edge.node.to.slice(0, 6) + '...' + edge.node.to.slice(-4) }</p>
                </div>
                <div class="objekt">
                    <button on:click={() => pushState(`/objekt/${edge.node.objekt.collection.id}/${edge.node.objekt.serial}`, 
                        { collection: edge.node.objekt.collection, objekt: edge.node.objekt, previous: $page.url.href })}>
                        { Subsquid.formatObjekt(edge.node.objekt.collection, edge.node.objekt) }
                    </button>
                    <div class="spacer"></div>
                    {#if objektAge < 60}
                        <p>{Math.floor(objektAge)} seconds ago</p>
                    {:else if objektAge < 3600}
                        <p>{Math.floor(objektAge / 60)} minutes ago</p>
                    {:else}
                        <p>{Math.floor(objektAge / 3600)} hours ago</p>
                    {/if}
                </div>
            </div>
            {#if i < 4}
                <hr>
            {/if}
        {/each}
    {:else}
        {#each { length: 5 } as _, i}
            <div class="transfer">
                <div class="users">
                    <div class="textPlaceholder" style:width="120px"></div>
                    <div class="spacer"></div>
                    <div class="textPlaceholder" style:width="120px"></div>
                </div>
                <div class="objekt">
                    <div class="textPlaceholder" style:width="140px"></div>
                    <div class="spacer"></div>
                    <div class="textPlaceholder" style:width="100px"></div>
                </div>
            </div>
            {#if i < 4}
                <hr>
            {/if}
        {/each}
    {/if}
</div>

<style>
    .widget {
        min-width: 310px;
    }
    
    .transfer {
        padding: 15px;
        display: flex;
        flex-direction: column;
        gap: 15px;
    }

    .users, .objekt, .user {
        display: flex;
        align-items: center;
        gap: 5px;
    }

    .objekt button {
        text-decoration: underline;
        background: none;
        padding: 0;
        border: none;
        color: inherit;
        font-size: inherit;
    }

    .spacer {
        flex: 1;
    }

    .profileImage {
        height: 25px;
        border-radius: 12.5px;
    }
</style>