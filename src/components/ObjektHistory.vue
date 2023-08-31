<script setup>
import getUser from '../utils/user'
</script>

<template>
    <table class="history">
        <tr>
            <th>At</th>
            <th>From</th>
            <th>To</th>
        </tr>
        <tr v-for="transfer in transfers">
            <td>
                {{ new Date(Number(transfer.timestamp)).toLocaleDateString('en-US', {
                    year: '2-digit', month: '2-digit', day: '2-digit'
                }) }}
                <br>
                {{ new Date(Number(transfer.timestamp)).toLocaleTimeString('en-US', {
                    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
                }) }}
            </td>
            <td>
                <RouterLink v-if="transfer.from.address !== nullAddress" :to="{ name: 'profile', params: { id: transfer.from.address } }">
                    {{ transfer.from.nickname }}
                </RouterLink>
                <b v-if="transfer.from.address === nullAddress">
                    Minted
                </b>
            </td>
            <td>
                <RouterLink v-if="transfer.to.address !== nullAddress" :to="{ name: 'profile', params: { id: transfer.to.address } }">
                    {{ transfer.to.nickname }}
                </RouterLink>
                <b v-if="transfer.to.address === nullAddress">
                    Reserved
                </b>
            </td>
        </tr>
    </table>
</template>

<script>
export default {
    data() {
        return {
            transfers: null,
            nullAddress: '0x0000000000000000000000000000000000000000'
        }
    },
    mounted() {
        fetch(this.SUBSQUID_API, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    query: `
                        query {
                            transfers(where: {objekt: {id_eq: "${this.token}"}}) {
                                timestamp
                                from
                                to
                            }
                        }
                    `
                })
            })
        .then(async (res) => {
            const json = await res.json()
            const transfers = json.data.transfers.map(async (transfer) => {
                return {
                    ...transfer,
                    from: await getUser(transfer.from),
                    to: await getUser(transfer.to)
                }
            })
            this.transfers = await Promise.all(transfers)
        })
    },
    props: {
        token: String
    }
}
</script>

<style scoped>
.history {
    table-layout: fixed;
    max-width: 100%;
    font-size: 18px;
    text-align: center;
    border-collapse: collapse;
}

td, th {
    padding: 10px 0;
}

.history tr:nth-child(even) {
    background-color: rgba(255, 255, 255, 0.05);
}

a {
    color: inherit;
}

b {
    font-weight: bold;
}
</style>
