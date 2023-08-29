<script setup>
import Objekt3DView from './Objekt3DView.vue'
import getArtists from '../utils/artists'
</script>

<template>
    <div class="blur" @click.self="$router.push(lastRoute)">
        <div class="modal">
            <div id="indicator" v-if="!data">
                <img id="spinner" src="@/assets/icons/spinner.svg">
            </div>
            <div id="content" v-if="data">
                <div id="imageView" :class="{ 'view3D': view3D }">
                    <Objekt3DView v-if="view3D" id="objekt3DView" :front="data.front" :back="data.back"/>
                    <div id="controls">
                        <p>
                            <input type="checkbox" v-model="view3D">
                            3D View
                        </p>
                        <a :href="data.front" :download="collection + '.avif'">
                            <img src="@/assets/icons/download.svg">
                            Download HD
                        </a>
                    </div>
                    <div v-if="!view3D" id="card">
                        <div id="image" @click="flipped = !flipped" :class="{ flipped: flipped }">
                            <div class="side">
                                <img :src="data.front">
                            </div>
                            <div class="side" id="back">
                                <img :src="data.back">
                            </div>
                        </div>
                    </div>
                    <div id="tooltipContainer">
                        <p v-if="!view3D" id="tooltip">
                            <img src="@/assets/icons/tap.svg">
                            Click Objekt to flip
                        </p>
                        <p v-if="view3D" id="tooltip">
                            <img src="@/assets/icons/3d.svg">
                            Drag Objekt to pan
                        </p>
                    </div>
                </div>
                <div id="detailView">
                    <p><b>Artists</b>:</p>
                    <div class="chipList" v-if="artists.length">
                        <div class="chip" v-for="artist in data.artists">
                            <img :src="artists.find(a => a.name === artist).logoImageUrl">
                            <p>{{ artists.find(a => a.name === artist).title }}</p>
                        </div>
                    </div>
                    <p><b>Member</b>:</p>
                    <div class="chipList" v-if="members.length">
                        <div class="chip">
                            <img :src="members.find(m => m.name === data.member).profileImageUrl">
                            <p>{{ data.member }}</p>
                        </div>
                    </div>
                    <p><b>Season</b>:</p>
                    <p>{{ data.season }}</p>
                    <p><b>Class</b>:</p>
                    <p>{{ data.class }}</p>
                    <p><b>Collection</b>:</p>
                    <p>{{ data.number }}</p>
                    <p><b>Copies</b>:</p>
                    <p>{{ totalObjekts.toLocaleString('en-US') }}</p>
                    <hr>
                </div>
            </div>
            <RouterLink id="closeBtn" :to="lastRoute">
                <img src="@/assets/icons/close.svg">
            </RouterLink>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            data: null,
            totalObjekts: 0,
            flipped: false,
            view3D: false,
            artists: [],
            members: []
        }
    },
    props: {
        collection: String,
        serial: Number,
        lastRoute: {
            type: String,
            default: '/'
        }
    },
    async mounted() {
        this.artists = await getArtists()
        this.members = this.artists.flatMap(artist => artist.members)
        this.init()
    },
    watch: {
        collection() {
            this.init()
        }
    },
    methods: {
        init() {
            this.data = null
            fetch(this.SUBSQUID_API, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    query: `
                        query {
                            collectionById(id: "${this.collection}") {
                                artists
                                back
                                class
                                front
                                member
                                number
                                season
                            }
                            objektsConnection(orderBy: id_ASC, where: {collection: {id_eq: "${this.collection}"}}) {
                                totalCount
                            }
                        }

                    `
                })
            }).then(async (res) => {
                const json = await res.json()
                this.data = json.data.collectionById
                this.totalObjekts = json.data.objektsConnection.totalCount
            })
        }
    }
}
</script>

<style scoped>
.blur {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    backdrop-filter: blur(5px);
}

.modal {
    width: 900px;
    height: 600px;
    border-radius: 20px;
    box-shadow: rgba(0, 0, 0, 0.5) 0px 0px 20px;
    background-color: #232A30;
    overflow: auto;
    cursor: auto;
    position: relative;
}

#indicator {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}

#spinner {
    height: 100px;
}

#content {
    width: 100%;
    height: 100%;
    display: flex;
}

#imageView {
    position: relative;
    height: 100%;
    width: 50%;
    background-color: #171C20;
    overflow: hidden;
}

.view3D #controls {
    position: absolute;
    top: 0;
}

#controls {
    height: 12.5%;
    width: 100%;
    padding: 0 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

#controls a {
    color: inherit;
    text-decoration: none;
    padding: 10px;
    background-color: #232A30;
    border-radius: 5px;
    line-height: 1.25;
}

#controls p {
    padding: 10px;
    background-color: #232A30;
    border-radius: 5px;
}

#card {
    height: 75%;
}

#image {
    height: 100%;
    width: 100%;
    perspective: 500px;
    transition: transform 0.5s;
    transform-style: preserve-3d;
}

.flipped {
    transform: rotateY(180deg);
}

.side {
    height: 100%;
    width: 100%;
    position: absolute;
    cursor: pointer;
    backface-visibility: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
}

.side img {
    max-height: 100%;
}

#back {
    transform: rotateY(180deg);
}

#tooltipContainer {
    height: 12.5%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.view3D #tooltipContainer {
    position: absolute;
    bottom: 0;
}

#tooltip {
    padding: 10px 20px;
    background-color: #232A30;
    border-radius: 50px;
    line-height: 1.25;
}

#tooltip img, #controls a img {
    height: 1.25em;
    vertical-align: middle;
    display: inline-block;
}

#detailView {
    height: 100%;
    width: 50%;
    padding: 30px 20px;
    font-size: 22px;
    display: grid;
    grid-template-columns: auto 1fr;
    grid-auto-rows: 40px;
    gap: 10px 40px;
    align-items: center;
}

.chipList {
    display: flex;
    gap: 10px;
}

.chip {
    height: 40px;
    border-radius: 20px;
    padding: 0 10px;
    background-color: #9756FF;
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 18px;
}

.chip img {
    height: 30px;
    width: 30px;
    border-radius: 15px;
}

b {
    font-weight: bold;
}

hr {
    grid-column: span 2;
}

#closeBtn {
    position: absolute;
    top: 20px;
    right: 20px;
}

#closeBtn img {
    width: 30px;
    height: 30px;
}

#objekt3DView {
    width: 100%;
    height: 100%;
}
</style>