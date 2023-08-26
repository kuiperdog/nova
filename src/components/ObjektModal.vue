<template>
    <div class="modal">
        <div id="content" v-if="data">
            <div id="imageView">
                <img :src="data.front">
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
            data: null
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

#content {
    width: 100%;
    height: 100%;
    display: flex;
}

#imageView {
    height: 100%;
    width: 50%;
    background-color: #171C20;
    display: flex;
    justify-content: center;
    align-items: center;
}

img {
    height: 75%;
}

#detailView {
    height: 100%;
    width: 50%;
}
</style>