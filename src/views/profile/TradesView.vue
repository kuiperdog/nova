<script setup>
import getUser from '../../utils/user'
</script>

<template>
    <div class="tradesView">
        <div v-if="trades" class="trades">
            <template v-for="trade in trades">
                <div>
                    {{ new Date(Number(trade.timestamp)).toLocaleDateString('en-US', {
                        year: '2-digit', month: '2-digit', day: '2-digit'
                    }) }}
                    <br>
                    {{ new Date(Number(trade.timestamp)).toLocaleTimeString('en-US', {
                        hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
                    }) }}
                </div>
                <div>
                    <b>{{ trade.send ? 'Sent' : 'Received' }}</b>
                </div>
                <div>
                    <RouterLink :to="`/objekt/${trade.objekt.collection.id}/${trade.objekt.serial}`">
                        {{ Object.values(trade.objekt.collection).slice(1).join(' ') }} #{{ trade.objekt.serial }}
                    </RouterLink>
                </div>
                <div>
                    <b>{{ trade.send ? 'To' : 'From' }}</b>
                </div>
                <div>
                    <RouterLink v-if="trade.user.address !== nullAddress" :to="`/@${trade.user.address}`" class="userLink">
                        <img :src="trade.user.profileImageUrl">
                        {{ trade.user.nickname }}
                    </RouterLink>
                    <p v-else class="userLink">
                        <img :src="trade.user.profileImageUrl">
                        {{ trade.user.nickname }}
                    </p>
                </div>
            </template>
        </div>
        <img ref="loader" src="@/assets/icons/dots.svg" class="dots" :style="{ display: (loading || hasNext) ? 'block' : 'none' }">
    </div>
</template>

<script>
export default {
    data() {
        return {
            trades: [],
            nullAddress: '0x0000000000000000000000000000000000000000',
            loading: false,
            hasNext: false
        }
    },
    mounted() {
        this.load()

        const observer = new IntersectionObserver(this.handleIntersection, { threshold: 1 })
        observer.observe(this.$refs.loader)
    },
    methods: {
        async load() {
            if (this.loading)
                return
            this.loading = true

            const cursor = this.trades.length ? `after: "${this.trades.length}",` : ''
            const res = await fetch(this.SUBSQUID_API, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    query: `
                        query {
                            transfersConnection(orderBy: timestamp_DESC, first: 20, ${cursor} where: {from_eq: "${this.address}", OR: {to_eq: "${this.address}"}}) {
                                edges {
                                    node {
                                        from
                                        to
                                        timestamp
                                        objekt {
                                            serial
                                            collection {
                                                id
                                                season
                                                member
                                                number
                                            }
                                        }
                                    }
                                }
                                pageInfo {
                                    hasNextPage
                                }
                            }
                        }

                    `
                })
            })
            const data = await res.json()
            this.trades.push(...await Promise.all(data.data.transfersConnection.edges.map(async e => Object({
                ...e.node,
                send: e.node.from === this.address,
                user: await getUser(e.node.from !== this.address ? e.node.from : e.node.to)
            }))))
            this.hasNext = data.data.transfersConnection.pageInfo.hasNextPage
            this.loading = false
        },
        handleIntersection(entries) {
            if (entries[0].isIntersecting && !this.loading && this.hasNext)
                this.load()
        }
    },
    props: {
        address: String
    }
}
</script>

<style scoped>
.tradesView {
    display: flex;
    align-items: center;
    flex-direction: column;
    font-size: 18px;
}

.dots {
    width: 50px;
}

.trades {
    display: grid;
    grid-template-columns: repeat(5, auto);
}

.trades > div {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px 20px;
    text-align: center;
}

.trades > div:nth-child(10n + 1),
.trades > div:nth-child(10n + 2),
.trades > div:nth-child(10n + 3),
.trades > div:nth-child(10n + 4),
.trades > div:nth-child(10n + 5) {
  background: rgba(255, 255, 255, 0.05);
}

.userLink {
    display: flex;
    gap: 10px;
    align-items: center;
}

.userLink img {
    height: 30px;
    border-radius: 15px;
}

a {
    color: inherit;
}

@media only screen and (max-width: 760px) {
    .trades {
        grid-template-columns: repeat(2, 1fr);
    }
    .trades > div:nth-child(5n + 1) {
        margin-top: 10px;
        grid-column: span 2;
    }
    .trades > div:nth-child(5n + 1) br {
        display: none;
    }
}
</style>
