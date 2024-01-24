<script lang="ts">
    import { Subsquid } from '$lib/data/apis';
    import { formatEther } from 'ethers';
    import { t, number } from 'svelte-i18n';

    export let contract: string;
    export let poll: number;
    export let revealedVotes: number;
    export let totalVotes: number;

    let votes: number[];

    fetch(Subsquid.URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            query: `
                query {
                    votes(limit: 99999, where: {contract_eq: "${contract}", poll_eq: "${poll}"}) {
                        amount
                    }
                }
            `
        })
    }).then(async (res) => {
        const data = await res.json();
        votes = data.data.votes.map((v: Subsquid.Vote) => Number(formatEther(v.amount)));
    });

    let clientWidth: number;
    let bars: number[];
    
    $: if (clientWidth) {
        if (votes) {
            let items = [...votes];
            let sum = [];
            for (let i = (clientWidth - 10) / 20; i > 0; i--)
                sum.push(items.splice(0, Math.ceil(items.length / i)).reduce((a, b) => a + b, 0));
            bars = sum;
        } else {
            bars = Array(Math.floor((clientWidth - 10) / 20)).fill(0);
        }
    }
</script>

<div class="graph">
    <div class="bars" bind:clientWidth>
        {#if bars}
            {#each bars as bar, i}
                <div class="bar" class:active={votes && revealedVotes/totalVotes >= i/bars.length}
                    style:height="{votes ? bar / Math.max(...bars) * 100 : 10}%" title="{bar.toLocaleString('en-US')} COMO"/>
            {/each}
        {/if}
    </div>
    <div class="progressBar">
        <div class="progress" style:width="{revealedVotes / totalVotes * 100}%"></div>
    </div>
    <div class="text">
        <p>
            {$t('gravity.totalvotes', { values: { votes: `${$number(revealedVotes)}/${$number(totalVotes)}` } })} ({Math.round(revealedVotes / totalVotes * 100)}%)
        </p>
    </div>
</div>

<style>
    .graph {
        background-color: var(--item-color);
        border-radius: 20px;
        padding: 20px;
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .bars {
        height: 150px;
        display: flex;
        justify-content: space-between;
        align-items: end;
    }

    .bar {
        width: 10px;
        border-radius: 5px;
        background-color: var(--item-secondary);
        transition: background-color .25s, height .25s;
    }

    .bar.active {
        background-color: var(--accent-color);
    }

    .progressBar {
        height: 20px;
        border-radius: 10px;
        background-color: var(--item-secondary);
        overflow: hidden;
    }

    .progressBar .progress {
        height: 100%;
        background-color: var(--accent-color);
    }

    .text {
        display: flex;
        align-items: center;
        height: 20px;
        line-height: 20px;
    }
</style>