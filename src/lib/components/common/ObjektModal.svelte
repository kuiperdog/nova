<script lang="ts">
	import { goto, pushState } from "$app/navigation";
    import { page } from "$app/stores";
    import { Subsquid, Cosmo } from "$lib/data/apis";
    import tap_icon from "$lib/assets/icons/tap.svg";
    import view_3d_icon from "$lib/assets/icons/3d.svg";
    import heart_icon from "$lib/assets/icons/heart.svg";
    import filled_heart_icon from "$lib/assets/icons/filled_heart.svg";
    import download_icon from "$lib/assets/icons/download.svg";
    import close_icon from "$lib/assets/icons/close.svg";
    import find_icon from "$lib/assets/icons/find.svg";
    import status_ok_icon from "$lib/assets/icons/status_ok.svg";
    import status_warning_icon from "$lib/assets/icons/status_warning.svg";
    import status_error_icon from "$lib/assets/icons/status_error.svg";
    import qr_image from "$lib/assets/images/qr.png";
	import { likes } from "$lib/data/likes";
    import Objekt3DView from "./Objekt3DView.svelte";

    export let collection: Subsquid.Collection;
    export let objekt: Subsquid.Objekt | null = null;

    let artists: Cosmo.Artist[];
    Cosmo.artists().then(a => artists = a);

    let total: number;
    let transfers: Subsquid.Transfer[];
    let users: Cosmo.User[];

    fetch(Subsquid.URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            query: `
                query {
                    objektsConnection(orderBy: id_ASC, where: {collection: {id_eq: "${collection.id}"}}) {
                        totalCount
                    }
                    ${collection.timestamp ? '' : `
                        collectionById(id: "${collection.id}") {
                            ${Object.keys(Subsquid.Collection).join('\n')}
                        }
                    `}
                    ${objekt ? `
                        transfersConnection(orderBy: timestamp_ASC, where: {objekt: {collection: {id_eq: "${collection.id}"}, serial_eq: ${objekt.serial}}}) {
                            edges {
                                node {
                                    ${Object.keys(Subsquid.Transfer).join('\n')}
                                }
                            }
                        }
                        ${!objekt.id ? `
                            objekts(where: {collection: {id_eq: "${collection.id}"}, serial_eq: ${objekt.serial}}) {
                                ${Object.keys(Subsquid.Objekt).join('\n')}
                            }
                        ` : ''}
                    ` : ''}
                }
            `
        })
    }).then(async res => {
        const data = await res.json();

        total = data.data.objektsConnection.totalCount;

        if (!collection.timestamp)
            collection = data.data.collectionById;

        if (objekt) {
            transfers = data.data.transfersConnection.edges.map((e: { node: Subsquid.Transfer }) => e.node);
            
            const profiles = await fetch(`${Cosmo.URL}/user/v1/by-address/${transfers.map(t => t.to).join(',')}`);
            users = await profiles.json();

            if (!objekt.id) {
                if (data.data.objekts.length)
                    objekt = data.data.objekts[0];
                else
                    objekt.minted = -1;
            }
        }
    });

    function close() {
        if ($page.state.previous)
            pushState($page.state.previous, { collection: null, objekt: null, previous: null });
        else
            goto('/objekt');
    }

    function find() {
        if (!nextSerial)
            return;

        pushState(`/objekt/${collection.id}/${nextSerial}`, {
            collection: collection,
            objekt: { ...Subsquid.Objekt, serial: nextSerial },
            previous: $page.state.previous
        });

        if (!$page.state.previous)
            objekt = { ...Subsquid.Objekt, serial: nextSerial };
    }

    $: {
        if ($page.state.objekt && objekt && objekt.minted === 0) {
            objekt = { ...Subsquid.Objekt, serial: $page.state.objekt.serial, minted: 1 };
            fetch(Subsquid.URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    query: `
                        query {
                            objektsConnection(orderBy: id_ASC, where: {collection: {id_eq: "${collection.id}"}, serial_eq: ${objekt.serial}}) {
                                edges {
                                    node {
                                        ${Object.keys(Subsquid.Objekt).join('\n')}
                                    }
                                }
                            }
                            transfersConnection(orderBy: timestamp_ASC, where: {objekt: {collection: {id_eq: "${collection.id}"}, serial_eq: ${objekt.serial}}}) {
                                edges {
                                    node {
                                        ${Object.keys(Subsquid.Transfer).join('\n')}
                                    }
                                }
                            }
                        }
                    `
                })
            }).then(async res => {
                const data = await res.json();

                if (!data.data.objektsConnection.edges.length && objekt) {
                    objekt.minted = -1;
                } else {
                    transfers = data.data.transfersConnection.edges.map((e: { node: Subsquid.Transfer }) => e.node);
                    const profiles = await fetch(`${Cosmo.URL}/user/v1/by-address/${transfers.map(t => t.to).join(',')}`);
                    users = await profiles.json();
                    objekt = data.data.objektsConnection.edges[0].node;
                }
            })
        }
    }

    let viewHeight: number;
    let nextSerial: number;
    let frontLoaded = false;
    let frontImg: HTMLImageElement;
    let backLoaded = false;
    let backImg: HTMLImageElement;
    let cardFlipped = false;
    let findBtn: HTMLButtonElement;
    let view3d = false;
    if (objekt && objekt.serial)
        nextSerial = objekt.serial;
</script>

<svelte:head>
    {#key $page.route}
        <title>Nova{collection ? ' | ' + Subsquid.formatObjekt(collection) : ''}</title>
    {/key}
</svelte:head>

<div class="modalBackground">
    <div class="modal">
        <div class="objektView" class:view3dActive={view3d}>
            <div class="objektHeader">
                <div class="objektTooltip">
                    <img src={tap_icon} alt="Click Objekt to flip">
                    <p>Click Objekt to flip</p>
                </div>
            </div>
            {#if view3d}
                <div class="view3d">
                    <Objekt3DView front={collection.front} back={collection.back}/>
                </div>
            {:else}
                <button class="objektPreview" bind:clientHeight={viewHeight} on:click={() => cardFlipped = !cardFlipped} class:objektFlipped={cardFlipped}>
                    <div class="objektFront" style="width: {viewHeight * 330.15/510}px;">
                        <div class="objektSide" style="opacity: {frontLoaded || frontImg && frontImg.complete ? '1' : '0'};">
                            <img class="objektImage" bind:this={frontImg} on:load={() => frontLoaded = true} src={collection.front} alt={Subsquid.formatObjekt(collection)}>
                            <div class="sideBar" style="font-size: {viewHeight * 330.15/510 * 0.05}px; color: {collection.textColor};">
                                <p>
                                    { collection.number }
                                    {#if objekt}
                                        <span class="previewSerial"> #{objekt.serial.toString().padStart(5, '0')}</span>
                                    {/if}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div class="objektBack" style="width: {viewHeight * 330.15/510}px;">
                        <div class="objektSide" style="opacity: {backLoaded || backImg && backImg.complete ? '1' : '0'};">
                            <img class="objektImage" bind:this={backImg} on:load={() => backLoaded = true} src={collection.back} alt={Subsquid.formatObjekt(collection)}>
                            <div class="sideBar" style="font-size: {viewHeight * 330.15/510 * 0.05}px; color: {collection.textColor};">
                                <p>
                                    { collection.number }
                                    {#if objekt}
                                        <span class="previewSerial"> #{objekt.serial.toString().padStart(5, '0')}</span>
                                    {/if}
                                </p>
                            </div>
                            <img class="qr" src={qr_image} alt="QR" style="height: {viewHeight * 330.15/510 * 0.25}px;">
                        </div>
                    </div>
                </button>
            {/if}
            <div class="objektButtons">
                <button on:click={() => view3d = !view3d} class="view3dButton">
                    <img src={view_3d_icon} alt="3D View">
                </button>
                <button on:click={() => $likes = $likes.find(c => c.id === collection.id) ? $likes.filter(c => c.id !== collection.id) : [ collection, ...$likes ]}>
                    <img src={$likes.find(c => c.id === collection.id) ? filled_heart_icon : heart_icon} alt="Like">
                </button>
                <button on:click={() => window.open(cardFlipped ? collection.back : collection.front, '_blank')}>
                    <img src={download_icon} alt="Download">
                </button>
            </div>
        </div>
        <div class="detailView" class:specialObjekt={collection.class === 'Special'} style:background-color={collection.class !== 'Special' ? collection.backgroundColor : ''}>
            <div>
                <div class="collectionDetails">
                    <div>
                        <b>Artist:</b>
                        {#if artists && collection.artists[0]}
                            <div class="profile">
                                <img class="profileImage" src={artists.find(a => a.name === collection.artists[0])?.logoImageUrl} alt={collection.artists[0]}>
                                <p>{artists.find(a => a.name === collection.artists[0])?.title}</p>
                            </div>
                        {:else}
                            <div class="profile profileSkeleton"></div>
                        {/if}
                    </div>
                    <hr>
                    <div>
                        <b>Member:</b>
                        <div class="profile">
                            {#if artists && collection.member}
                            {@const member = artists.find(a => a.name === collection.artists[0])?.members.find(m => m.name === collection.member)}
                                {#if member}
                                    <img class="profileImage" alt={member.name} src={member.profileImageUrl}>
                                {/if}
                                <p>{collection.member}</p>
                            {:else}
                                <div class="profile profileSkeleton"></div>
                            {/if}
                        </div>
                    </div>
                </div>
                <hr>
                <div class="collectionDetails">
                    <div>
                        <b>Season:</b>
                        <p>{collection.season}</p>
                    </div>
                    <hr>
                    <div>
                        <b>Class:</b>
                        <p>{collection.class}</p>
                    </div>
                    <hr>
                    <div>
                        <b>Collection:</b>
                        <p>{collection.number}</p>
                    </div>
                </div>
            </div>
            <div class="serialSelector">
                <b>Serial:</b>
                <p class="serial">#</p>
                <input type="number" placeholder="00000" size="5" min="0" maxlength="5" inputmode="numeric"
                    bind:value={nextSerial} on:keydown={(e) => { if (e.key === 'Enter') findBtn.click() }}>
                <p class="totalSlash">/</p>
                {#if total}
                    <p>{total.toLocaleString('en-US')} copies</p>
                {:else}
                    <div class="totalSkeleton"></div>
                {/if}
                <button class="findButton" bind:this={findBtn} on:click={() => find()}>
                    <img src={find_icon} alt="Find">
                    Find
                </button>
            </div>
            {#if objekt}
                {#if objekt.id && transfers && users}
                {@const owner = users.find(u => u.address === objekt?.owner)}
                    {@const objektAge = (Date.now() - objekt.minted) / 1000}
                    <div class="objektDetails">
                        <div class="objektOwner">
                            <b>Owner:</b>
                            <a class="profile" href="/@{owner ? owner.nickname : objekt.owner}">
                                <img class="profileImage" src="https://static.cosmo.fans/uploads/images/img_profile_gallag@3x.png" alt={objekt.owner}>
                                { owner ? owner.nickname : objekt.owner.slice(0, 6) + '...' + objekt.owner.slice(-4) }
                            </a>
                        </div>
                        <hr>
                        <div class="objektInfo">
                            <div>
                                <b>Age:</b>
                                {#if objektAge < 60}
                                    <p>{Math.floor(objektAge)} seconds</p>
                                {:else if objektAge < 3600}
                                    <p>{Math.floor(objektAge / 60)} minutes</p>
                                {:else if objektAge < 86400}
                                    <p>{Math.floor(objektAge / 3600)} hours</p>
                                {:else}
                                    <p>{Math.floor(objektAge / 86400)} days</p>
                                {/if}
                            </div>
                            <hr>
                            <div>
                                <b>Sendable:</b>
                                <img src={objekt.transferrable ? status_ok_icon : status_error_icon} alt={objekt.transferrable ? 'Yes' : 'No'}>
                            </div>
                        </div>
                    </div>
                    <div class="tradeDetails">
                        <div class="tradesHeader">
                            <b>History</b>
                            <p>{transfers.length} transfers</p>
                        </div>
                        <hr>
                        {#each transfers as transfer, index}
                        {@const user = users.find(u => u.address === transfer.to)}
                            <div class="trade">
                                <div>
                                    <p>{ new Date(Number(transfer.timestamp)).toLocaleString('en-GB') }</p>
                                </div>
                                <hr>
                                <div>
                                    <a class="profile" href="/@{user ? user.nickname : transfer.to}">
                                        <img class="profileImage" src="https://static.cosmo.fans/uploads/images/img_profile_gallag@3x.png" alt={transfer.to}>
                                        { user ? user.nickname : transfer.to.slice(0, 6) + '...' + transfer.to.slice(-4) }
                                    </a>
                                </div>
                            </div>
                            {#if index < transfers.length - 1}
                                <hr>
                            {/if}
                        {/each}
                    </div>
                {:else if objekt.minted < 0}
                    <div class="unmintedDetails">
                        <img src={status_warning_icon} alt="Unminted">
                        <p>Objekt has not been minted yet.</p>
                    </div>
                {:else}
                    <div class="unmintedSkeleton">
                        <div></div>
                        <div></div>
                    </div>
                {/if}
            {/if}
        </div>
        <button class="closeButton" on:click={() => close()}>
            <img src={close_icon} alt="Close">
        </button>
    </div>
    <button class="modalExit" on:click={() => close()}/>
</div>

<style>
    .modalBackground {
        position: fixed;
        top: calc(50px + env(safe-area-inset-top));
        left: 0;
        width: 100%;
        height: calc(100% - 50px - env(safe-area-inset-top));
        z-index: var(--nav-z-index);
        backdrop-filter: blur(5px);
        -webkit-backdrop-filter: blur(5px);
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .modalExit {
        background: none;
        padding: 0;
        border: none;
        width: 100%;
        height: 100%;
        position: absolute;
        cursor: pointer;
        z-index: -1;
    }

    .modal {
        width: 860px;
        height: 680px;
        border-radius: 25px;
        background-color: var(--item-color);
        box-shadow: var(--box-shadow);
        display: flex;
        overflow: hidden;
        position: relative;
    }

    .objektView, .detailView {
        flex: 1;
        height: 100%;
    }

    .objektView {
        display: flex;
        flex-direction: column;
        align-items: center;
        position: relative;
        transition: background-color .1s;
    }

    .objektView.view3dActive {
        background-color: #000000;
    }

    .objektHeader, .objektButtons {
        height: 12.5%;
        width: 100%;
        font-size: 16px;
        line-height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 25px;
    }

    .objektTooltip {
        display: flex;
        align-items: center;
        gap: 5px;
        height: 35px;
        padding: 0 15px;
        border-radius: 20px;
        background-color: var(--item-secondary);
        box-shadow: var(--box-shadow);
    }

    .objektTooltip img {
        height: 20px;
    }

    .view3dActive .objektHeader {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 1;
    }

    .view3dActive .objektButtons {
        position: absolute;
        bottom: 0;
        left: 0;
        z-index: 1;
    }

    .view3d {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        animation: fade-in .1s;
    }

    .objektPreview {
        height: 75%;
        background: none;
        border: none;
        cursor: pointer;
        perspective: 500px;
        transition: transform 0.5s;
        transform-style: preserve-3d;
        position: relative;
    }

    .objektFlipped {
        transform: rotateY(180deg);
    }

    .objektFront,
    .objektBack {
        height: 100%;
        backface-visibility: hidden;
        position: absolute;
        top: 0;
        left: 50%;
        transform: translateX(-50%);
        background-color: var(--item-secondary);
        border-radius: 5% / calc(5% * 330.15/510);
    }

    .objektSide {
        height: 100%;
        transition: opacity 0.5s;
    }

    .objektBack {
        transform: translateX(-50%) rotateY(180deg);
    }

    .objektImage {
        height: 100%;
    }

    .sideBar {
		position: absolute;
		top: 0;
		right: 0;
		width: 11%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		writing-mode: vertical-lr;
		font-family: 'Helvetica Neue';
		text-align: center;
		padding-right: 1.5%;
	}

    .qr {
        position: absolute;
        bottom: 21.5%;
        right: 25.5%;
    }

    .previewSerial {
        font-family: 'Dot-Matrix';
    }

    .objektBack .sideBar {
        right: 10%;
    }

    .objektButtons button, .closeButton {
        height: 50px;
        width: 50px;
        border-radius: 25px;
        background-color: var(--item-secondary);
        box-shadow: var(--box-shadow);
        border: none;
        padding: 0;
        cursor: pointer;
        transition: transform .1s, background-color .1s;
    }

    .objektButtons button:active {
        transform: scale(.95);
    }

    .view3dActive .view3dButton {
        background-color: var(--accent-color);
    }

    .closeButton {
        background-color: var(--item-secondary-semitransparent);
        position: absolute;
        top: 12.5px;
        right: 12.5px;
    }

    .objektButtons button img,
    .closeButton img {
        width: 30px;
        margin: 10px;
    }

    .detailView {
        background-color: var(--item-secondary);
        padding: 12.5px;
        padding-top: 75px;
        display: flex;
        flex-direction: column;
        gap: 12.5px;
        overflow-y: scroll;
        transition: background-color .1s;
    }

    .detailView.specialObjekt {
        background: linear-gradient(135deg, #f9e6e0 0%, #d1d8e8 25%, #f2e2cb 50%, #fcc4db 75%, #b1a7f0 100%);
    }

    .detailView > div {
        background-color: var(--item-color);
        border-radius: 25px;
        flex-shrink: 0;
    }

    .collectionDetails {
        height: 100px;
        display: flex;
    }

    .collectionDetails > div, .objektOwner {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        flex-direction: column;
    }

    .profile {
        display: flex;
        gap: 5px;
        align-items: center;
        color: inherit;
    }

    .profileSkeleton {
        height: 25px;
        width: 100px;
        border-radius: 12.5px;
        background-color: var(--item-secondary);
    }

    .profileImage {
        height: 25px;
        border-radius: 12.5px;
        background-color: var(--item-secondary);
    }

    .serialSelector {
        height: 50px;
        display: flex;
        align-items: center;
        padding: 0 25px;
    }

    .serial {
        margin-left: 5px;
    }

    input[type="number"] {
        background: none;
        border: none;
        color: inherit;
        border-bottom: var(--text-color) 1px solid;
        max-width: 60px;
        border-radius: 0;
        padding: 0;
        outline: none;
    }

    .serial, input[type="number"] {
        font-weight: bold;
        font-size: 16px;
        font-family: 'Dot-Matrix';
        margin-bottom: -1.5%;
    }

    .totalSlash {
        margin: 0 5px;
    }

    .totalSkeleton {
        margin-left: 5px;
        height: 20px;
        width: 75px;
        border-radius: 10px;
        background-color: var(--item-secondary);
    }

    .findButton {
        background-color: var(--accent-color);
        height: 25px;
        border-radius: 12.5px;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0px 12.5px;
        color: inherit;
        font-size: inherit;
        border: none;
        margin-left: auto;
        cursor: pointer;
    }

    .unmintedDetails, .unmintedSkeleton {
        height: 50px;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 10px;
    }

    .unmintedSkeleton div {
        background-color: var(--item-secondary);
        width: 20px;
        height: 20px;
        border-radius: 10px;
    }
    
    .unmintedSkeleton div:nth-child(2) {
        width: 230px;
    }

    .objektDetails {
        display: flex;
        height: 100px;
    }

    .objektDetails > div {
        flex: 1;
    }

    .objektInfo > div {
        height: 50%;
        display: flex;
        align-items: center;
        padding: 0 15px;
    }

    .objektInfo > div b {
        flex: 1;
    }

    .tradeDetails > div,
    .trade div {
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .tradesHeader {
        padding: 0 25px;
    }

    .tradesHeader b {
        margin-right: auto;
    }

    .trade {
        display: flex;
    }

    .trade hr {
        height: 100%;
    }

    .trade div {
        flex: 1;
    }

    @media only screen and (max-width: 700px) {
        .modal {
            width: 100%;
            height: 100%;
            border-radius: 0;
            display: initial;
            overflow-y: auto;
        }

        .objektView, .detailView {
            width: 100%;
        }

        .objektView {
            height: calc(100vh - 87.5px);
            max-height: calc((100vw - 60px) * 2230/1083);
        }

        .detailView {
            padding-top: 12.5px;
            padding-bottom: 75px;
            height: initial;
        }

        .closeButton {
            position: fixed;
            top: initial;
            bottom: 12.5px;
        }
    }
</style>