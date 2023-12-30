<script lang="ts">
    import { Cosmo, Polygon } from "$lib/data/apis";
    import status_ok_icon from "$lib/assets/icons/status_ok.svg";
    import status_warning_icon from "$lib/assets/icons/status_warning.svg";
    import status_errror_icon from "$lib/assets/icons/status_error.svg";
    import { formatUnits } from "ethers";

    export let data: any;
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

    $: if (data) {
        if (!data.data) {
            nova = status_errror_icon;
            message = 'Database Unreachable';
        } else {
            Polygon.RPC.getBlockNumber().then(height => {
                if (data.data.squidStatus.height < height - 3800) {
                    nova = status_warning_icon;
                    message = 'Database Unsynced';
                } else {
                    nova = status_ok_icon;
                }
            });
        }
    }

    checkCosmo();
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
        min-width: 345px;
        border-radius: 25px;
        background-color: var(--item-color);
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