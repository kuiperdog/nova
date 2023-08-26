<template>
    <div class="modal">
        <div id="indicator" v-if="!data">
            <img id="spinner" src="@/assets/spinner.svg">
        </div>
        <div id="content" v-if="data">
            <div id="imageView">
                <div id="controls">
                    <p>
                        <input type="checkbox">
                        3D View
                    </p>
                    <a :href="data.front" :download="collection + '.avif'">
                        <img src="@/assets/download.svg">
                        Download HD
                    </a>
                </div>
                <div id="card">
                    <img @click="back = !back" :src="back ? data.back : data.front">
                </div>
                <div id="tooltipContainer">
                    <p id="tooltip">
                        <img src="@/assets/tap.svg">
                        Click Objekt to flip
                    </p>
                </div>
            </div>
            <div id="detailView">
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            data: null,
            back: false
        }
    },
    props: {
        collection: String,
        serial: Number
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
                        }

                    `
                })
            }).then(async (res) => {
                this.data = (await res.json()).data.collectionById
            })
        }
    }
}
</script>

<style scoped>
.modal {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 900px;
    height: 600px;
    border-radius: 20px;
    box-shadow: rgba(0, 0, 0, 0.5) 0px 0px 20px;
    background-color: #232A30;
    overflow: auto;
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

#card img {
    height: 100%;
    display: block;
    margin: 0 auto;
    cursor: pointer;
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
}
</style>