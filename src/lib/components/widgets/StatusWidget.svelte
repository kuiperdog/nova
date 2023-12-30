<script lang="ts">
    import { Cosmo, Subsquid, Polygon } from "$lib/data/apis";
    import status_ok_icon from "$lib/assets/icons/status_ok.svg";
    import status_warning_icon from "$lib/assets/icons/status_warning.svg";
    import status_errror_icon from "$lib/assets/icons/status_error.svg";
    import { formatUnits } from "ethers";

    let cosmo: string;
    let polygon: string;
    let nova: string;
    let message: string = 'All Systems Go';

    async function checkCosmo() {
        try {
            const res = await fetch(Cosmo.URL);
            const data = await res.json();
            if (!data)
                throw new Error();
            cosmo = status_ok_icon;
        } catch {
            cosmo = status_errror_icon;
            message = 'Cosmo Unreachable';
        }
    }

    async function checkNova() {
        try {
            const res = await fetch(Subsquid.URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    query: `
                        query {
                            squidStatus {
                                height
                            }
                        }
                    `
                })
            });

            const data = await res.json();
            if (!data || !data.data)
                throw new Error();

            if (data.data.squidStatus.height < (await Polygon.RPC.getBlockNumber() - 3800)) {
                nova = status_warning_icon;
                message = 'Database Unsynced';
                console.log(data.data.squidStatus.height);
                console.log(await Polygon.RPC.getBlockNumber());
            } else {
                nova = status_ok_icon;
            }
        } catch {
            nova = status_errror_icon;
            message = 'Database Unreachable';
        }
    }

    async function checkPolygon() {
        try {
            const fees = await Polygon.RPC.getFeeData();
            if (Number(formatUnits(fees.gasPrice!, 'gwei')) > 400) {
                polygon = status_warning_icon;
                message = 'Blockchain Congested';
            } else {
                polygon = status_ok_icon;
            }
        } catch {
            polygon = status_errror_icon;
            message = 'Blockchain Unreachable';
        }
    }

    checkCosmo();
    checkNova();
    checkPolygon();
</script>

<div class="widget">
    <div class="header">
        <b>System Status</b>
        {#if cosmo && polygon && nova}
            <p>{ message }</p>
        {:else}
            <div class="messagePlaceholder"></div>
        {/if}
    </div>
    <hr>
    <div class="content">
        <div class="item">
            <p>Cosmo:</p>
            {#if cosmo}
                <img src={cosmo} alt="Status">
            {:else}
                <div class="statusPlaceholder"></div>
            {/if}
        </div>
        <hr>
        <div class="item">
            <p>Polygon:</p>
            <img src={status_ok_icon} alt="Status">
        </div>
        <hr>
        <div class="item">
            <p>Nova:</p>
            {#if nova}
                <img src={nova} alt="Status">
            {:else}
                <div class="statusPlaceholder"></div>
            {/if}
        </div>
    </div>
</div>

<style>
    .widget {
        flex: 1;
        min-width: 350px;
        border-radius: 25px;
        background-color: var(--item-color);
        font-size: 16px;
    }

    .header {
        width: 100%;
        display: flex;
        align-items: center;
    }

    .header b,
    .item p {
        flex: 1;
    }

    .header, .item {
        padding: 20px 15px;
    }

    .content {
        width: 100%;
        display: flex;
    }

    .item {
        flex: auto;
        display: flex;
        align-items: center;
    }

    .statusPlaceholder {
        background-color: var(--item-secondary);
        width: 24px;
        height: 24px;
        border-radius: 12px;
    }

    .messagePlaceholder {
        background-color: var(--item-secondary);
        width: 110px;
        height: 20px;
        border-radius: 5px;
    }
</style>