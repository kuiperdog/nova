<script setup>
import { ethers } from 'ethers'
</script>

<template>
    <div v-if="!bars.length" class="voteChartLoading" :style="{ height: height + 'px' }">
        <img src="@/assets/icons/dots.svg">
    </div>
    <div v-if="bars.length" class="voteChart" :style="{ height: height + 'px' }">
        <div class="bar" v-for="bar in bars" :style="{ height: Math.floor((bar / this.peak) * height) + 'px' }"></div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            limit: 50,
            height: 250,
            bars: [],
            peak: 0
        }
    },
    async mounted() {
        const totalVotes = await this.getTotal()
        let queries = ''
        const size = Math.ceil(totalVotes / this.limit)
        for (let i = 0; i < this.limit; i++) {
            queries += `
                batch${i + 1}: votes(limit: ${size}, offset: ${size * i}, where: {poll_eq: "${this.poll}", contract_eq: "${this.contract.toLowerCase()}"}) {
                    amount
                }
            `
        }

        const res = await fetch(this.SUBSQUID_API, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: `
                    query {
                        ${queries}
                    }
                `
            })
        })
        const data = await res.json()
        this.bars = Object.values(data.data).map(batch => batch.reduce((a, b) => a + Math.round(ethers.formatEther(b.amount)), 0))
        this.peak = Math.max(...this.bars)
    },
    methods: {
        async getTotal() {
            const res = await fetch(this.SUBSQUID_API, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    query: `
                        query {
                            votesConnection(orderBy: id_ASC, where: {poll_eq: "${this.poll}", contract_eq: "${this.contract.toLowerCase()}"}) {
                                totalCount
                            }
                        }
                    `
                })
            })
            const data = await res.json()
            return data.data.votesConnection.totalCount
        }
    },
    props: {
        poll: Number,
        contract: String
    }
}
</script>

<style scoped>
.voteChart {
    display: flex;
    gap: 10px;
    align-items: end;
}

.bar {
    border-radius: 5px;
    background-color: #9756FF;
    flex: 1;
}

.voteChartLoading {
    display: flex;
    align-items: center;
    justify-content: center;
}

img {
    width: 50px;
}

.voteChart, .voteChartLoading {
    margin-bottom: -20px;
}
</style>