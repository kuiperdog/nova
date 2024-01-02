<script lang="ts">
    import { Cosmo, Subsquid } from "$lib/data/apis";
    import { formatEther } from "ethers";
    import { getAssets } from "$lib/data/assets";
    import ArtistSelector from "$lib/components/common/ArtistSelector.svelte";
    import find_icon from "$lib/assets/icons/find.svg";

    const CREATOR = '0xD5fc87DD8494d6B657bF0DE20111235d983CEC84';

    let users: Cosmo.User[] | undefined;
    let holders: Subsquid.Como[] | undefined;
    let artist: Cosmo.Artist;
    let selected: Cosmo.Artist | undefined;

    $: {
        if (selected && artist !== selected) {
            artist = selected;
            users = holders = undefined;
            fetch(Subsquid.URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    query: `
                        query {
                            comosConnection(orderBy: balance_DESC, first: 100, where: {contract_eq: "${artist.contracts.Como.toLowerCase()}", owner_not_eq: "${artist.contracts.CommunityPool}", AND: {owner_not_eq: "${CREATOR}"}}) {
                                edges {
                                    node {
                                        ${Object.keys(Subsquid.Como).join('\n')}
                                    }
                                }
                            }
                        }
                    `}
                )
            }).then(async res => {
                const data = await res.json();
                holders = data.data.comosConnection.edges.map((e: { node: Subsquid.Como }) => e.node);

                const mapping = await fetch(`${Cosmo.URL}/user/v1/by-address/${holders?.map((h: Subsquid.Como) => h.owner).join(',')}`);
                users = await mapping.json();
            })
        }
    }
</script>

<div class="layout">
    <div class="title">
        <p>Top 100 holders of</p>
        <ArtistSelector bind:selected/>
        <div class="como">
            {#if artist}
                <img class="comoImg" src={getAssets(artist).como} alt="COMO">
            {:else}
                <div class="comoImg placeholderImg"></div>
            {/if}
            <p>COMO</p>
        </div>
    </div>
    <div class="content">
        {#if holders && users}
            {#each holders as account, i}
                {@const user = users.find(u => u.address === account.owner)}
                <p class="listNumber"><b>#{i + 1}</b></p>
                <hr>
                <img class="profileImg" src="https://static.cosmo.fans/uploads/images/img_profile_gallag@3x.png" alt="User">
                <p>{user ? user.nickname : account.owner}</p>
                <hr>
                <p>{Math.round(Number(formatEther(account.balance))).toLocaleString('en-US')}</p>
                {#if i < holders.length - 1}
                    <hr class="vertical">
                {/if}
            {/each}
        {:else}
            {#each { length: 100 } as _, i}
                <div class="placeholder" style:width="38px"></div>
                <hr>
                <div class="placeholderImg"></div>
                <div class="placeholder" style:width="100px"></div>
                <hr>
                <div class="placeholder" style:width="50px"></div>
                {#if i < 99}
                    <hr class="vertical">
                {/if}
            {/each}
        {/if}
    </div>
    <div class="or">
        <div></div>
        <p>OR</p>
        <div></div>
    </div>
    <p class="hint">
        Find users by address or ID with the <img src={find_icon} alt="Search"> <b>Search</b> bar.
    </p>
</div>

<style>
    .layout {
        max-width: 450px;
        margin: 0 auto;
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 100%;
        flex-direction: column;
        gap: 20px;
        padding: 20px;
    }

    .title {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        font-size: 20px;
        flex-wrap: wrap;
    }

    .content {
        width: 100%;
        max-height: 450px;
        border-radius: 25px;
        background-color: var(--item-color);
        box-shadow: var(--box-shadow);
        overflow-y: auto;
        display: grid;
        padding: 20px;
        grid-template-columns: auto auto auto 1fr auto auto;
    }

    .content > p {
        padding: 10px;
    }

    .content > .placeholder {
        margin: 10px;
    }

    .content hr.vertical {
        grid-column: span 6;
        margin: 0 -20px;
    }

    .profileImg,
    .placeholderImg {
        height: 25px;
        width: 25px;
        border-radius: 12.5px;
        margin: auto;
        margin-left: 10px;
    }

    .or {
        width: 100%;
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 20px;
        font-size: 14px;
    }

    .or div {
        height: 1px;
        flex: 1;
        background-color: var(--item-color);
    }

    .hint {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        justify-content: center;
    }

    .hint img {
        margin-left: 3px;
    }

    .hint b {
        margin-right: 5px;
    }

    .placeholder {
        height: 20px;
        border-radius: 5px;
        background-color: var(--item-secondary);
    }

    .placeholderImg {
        background-color: var(--item-secondary);
    }

    .como {
        display: flex;
        align-items: center;
        gap: 5px;
    }

    .comoImg {
        width: 20px;
        height: 20px;
    }

    @media only screen and (max-width: 375px) {
        .layout {
            padding: 10px;
        }
    }
</style>
