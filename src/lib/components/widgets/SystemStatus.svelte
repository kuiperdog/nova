<script lang="ts">
    import { Cosmo, Polygon } from "$lib/data/apis";
    import status_ok_icon from "$lib/assets/icons/status_ok.svg";
    import status_warning_icon from "$lib/assets/icons/status_warning.svg";
    import status_errror_icon from "$lib/assets/icons/status_error.svg";
    import { formatUnits } from "ethers";
    import { t } from 'svelte-i18n';

    export let data: any;
    let cosmo: string;
    let polygon: string;
    let nova: string;
    let message: string = $t('widget.status.no_errors');
    let gas: number;

    async function checkCosmo() {
        try {
            const res = await fetch(Cosmo.URL);
            const data = await res.json();
            if (!data)
                throw new Error();
            cosmo = status_ok_icon;
        } catch {
            cosmo = status_errror_icon;
            message = $t('widget.status.cosmo_unreachable');
        }
    }

    async function checkPolygon() {
        try {
            const fees = await Polygon.RPC.getFeeData();
            gas = Number(formatUnits(fees.gasPrice!, 'gwei'));

            if (gas > 400) {
                polygon = status_warning_icon;
                message = $t('widget.status.blockchain_congested');
            } else {
                polygon = status_ok_icon;
            }
        } catch {
            polygon = status_errror_icon;
            message = $t('widget.status.blockchain_unreachable');
        }
    }

    $: if (data) {
        if (!data.data) {
            nova = status_errror_icon;
            message = $t('widget.status.db_unreachable');
        } else {
            Polygon.RPC.getBlockNumber().then(height => {
                if (data.data.squidStatus.height < height - 3800) {
                    nova = status_warning_icon;
                    message = $t('widget.status.db_unsynced');
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
        <b>{$t('widget.status.title')}</b>
        {#if cosmo && polygon && nova}
            <p class="message">{ message }</p>
        {:else}
            <div class="textPlaceholder" style:width="110px"></div>
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
            {#if polygon}
                <img src={polygon} alt="Status" title={gas ? `Gas: ${Math.round(gas).toLocaleString('en-US')} Gwei`: ''}>
            {:else}
                <div class="statusPlaceholder"></div>
            {/if}
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
        min-width: 345px;
    }

    .item p {
        flex: 1;
    }

    .item {
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

    .item img {
        width: 24px;
        height: 24px;
    }

    .item p, .item img, .message {
        animation: fade-in .1s;
    }
</style>