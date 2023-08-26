<template>
    <div class="blur" @click.self="$router.push(lastRoute)">
        <div class="modal">
            <div id="indicator" v-if="!data">
                <img id="spinner" src="@/assets/icons/spinner.svg">
            </div>
            <div id="content" v-if="data">
                <div id="imageView">
                    <div id="controls">
                        <p>
                            <input type="checkbox">
                            3D View
                        </p>
                        <a :href="data.front" :download="collection + '.avif'">
                            <img src="@/assets/icons/download.svg">
                            Download HD
                        </a>
                    </div>
                    <div id="card">
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
                        <p id="tooltip">
                            <img src="@/assets/icons/tap.svg">
                            Click Objekt to flip
                        </p>
                    </div>
                </div>
                <div id="detailView">
                    <RouterLink id="closeBtn" :to="lastRoute">
                        <img src="@/assets/icons/close.svg">
                    </RouterLink>
                    <p><b>Artist</b>: {{ data.artists[0] }}</p>
                    <p><b>Member</b>: {{ data.member }}</p>
                    <p><b>Season</b>: {{ data.season }}</p>
                    <p><b>Class</b>: {{ data.class }}</p>
                    <p><b>Collection</b>: {{ data.number }}</p>
                    <p><b>Copies</b>: {{ totalObjekts.toLocaleString('en-US') }}</p>
                    <hr>
                    <p><b>Serial</b>:</p>
                    <p><b>Owner</b>:</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            data: null,
            totalObjekts: 0,
            flipped: false
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
    mounted() {
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
            fetch('https://squid.subsquid.io/cosmo/v/v1/graphql', {
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
    height: 100%;
    width: 50%;
    background-color: #171C20;
    overflow: hidden;
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
    padding: 20px;
    font-size: 22px;
    position: relative;
}

#detailView p {
    margin: 10px 0px;
}

b {
    font-weight: bold;
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
</style>