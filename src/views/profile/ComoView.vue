<script setup>
import getArtists from '../../utils/artists'
import Dropdown from '../../components/Dropdown.vue'
</script>

<template>
    <div class="comoView" v-if="artists">
        <div class="header">
            <h2>{{ new Intl.DateTimeFormat(undefined, { month: 'long', year: 'numeric' }).format(new Date()) }}</h2>
            <Dropdown :options="artists" @valueChanged="x => load(x)"/>
        </div>
        <img v-if="loading" src="@/assets/icons/dots.svg" class="dots">
        <table v-else>
            <thead>
                <tr>
                    <th v-for="day in 7">
                        {{ new Intl.DateTimeFormat(undefined, { weekday: 'short' }).format(new Date(2024, 0, day)) }}
                    </th>
                </tr>
            </thead>
            <tbody>
                <template v-for="week in 6">
                    <tr v-if="(week - 1) * 7 < monthLength + offset">
                        <td v-for="day in 7" :class="{ today: new Date().getDate() === (week - 1) * 7 + day - offset }">
                            <div v-if="(week > 1 || day > offset) && (week - 1) * 7 + day - offset <= monthLength">
                                <p class="date">
                                    {{ (week - 1) * 7 + day - offset }}
                                </p>
                                <div v-if="como[(week - 1) * 7 + day - offset]" class="como">
                                    <p>+{{ como[(week - 1) * 7 + day - offset] }}</p>
                                    <img :src="artist.data.comoIcon">
                                </div>
                            </div>
                        </td>
                    </tr>
                </template>
            </tbody>
        </table>
    </div>
</template>

<script>
export default {
    data() {
        return {
            offset: null,
            monthLength: 0,
            como: [],
            loading: true,
            artists: null,
            artist: null
        }
    },
    async mounted() {
        const today = new Date()
        this.offset = new Date(today.getFullYear(), today.getMonth(), 1).getDay() - 1
        this.monthLength = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()
        
        this.artists = (await getArtists()).map(artist => Object({
            value: artist.name,
            label: artist.title,
            icon: artist.logoImageUrl,
            data: artist
        }))
        this.artist = this.artists[0]

        this.load()
    },
    methods: {
        async load(artist) {
            this.loading = true
            this.como = []

            if (artist)
                this.artist = this.artists.find(a => a.value === artist)
            
            const res = await fetch(this.SUBSQUID_API, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    query: `
                        query {
                            objektsConnection(orderBy: id_ASC, first: 100000, where: {owner_eq: "${this.address}", collection_isNull: false, collection: {class_eq: "Special", artists_containsAll: "${this.artist.data.name}"}}) {
                                edges {
                                    node {
                                        minted
                                    }
                                }
                            }
                        }
                    `
                })
            })
            const data = await res.json()

            for (let i = 1; i <= this.monthLength; i++)
                this.como[i] = 0

            for (const edge of data.data.objektsConnection.edges)
                this.como[Math.min(new Date(Number(edge.node.minted)).getDate(), this.monthLength)]++

            this.loading = false
        }
    },
    props: {
        address: String
    }
}
</script>

<style scoped>
.comoView {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 40px;
}

.header {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    table-layout: fixed;
}

th, td {
    border: 1px solid #2A333A;
}

th {
    background-color: rgba(42, 51, 58, 0.25);
    padding: 5px;
}

td {
    height: 100px;
}

td div {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.today {
    border: 1px solid #9756FF;
}

th:first-of-type {
    border-top-left-radius: 10px;
}

th:last-of-type {
    border-top-right-radius: 10px;
}

tr:last-of-type td:first-of-type {
    border-bottom-left-radius: 10px;
}
tr:last-of-type td:last-of-type {
    border-bottom-right-radius: 10px;
}

.date {
    margin: 5px auto auto 5px;
    height: 20px;
    color: #4A5A66;
}

.today .date {
    color: #9756FF;
}

.como {
    flex: 1;
    margin-top: -20px;
    text-align: center;
    font-weight: bold;
    display: flex;
    gap: 5px;
    flex-direction: row;
    align-items: center;
    justify-content: center;
}
.como img {
    height: 20px;
}

@media only screen and (max-width: 400px) {
    .como img {
        display: none;
    }
    .como p {
        background-color: #2A333A;
        border-radius: 5px;
        padding: 5px;
    }
}

.dots {
    width: 50px;
}
</style>
