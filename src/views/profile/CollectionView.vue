<script setup>
import ObjektGrid from '../../components/ObjektGrid.vue'
import getArtists from '../../utils/artists'
</script>

<template>
    <ObjektGrid
        :objekts="objekts"
        :total="total"
        :loading="loading"
        @loadNext="load()"
        @updated="reset()"/>
</template>

<script>
export default {
    data() {
        return {
            objekts: [],
            loading: false,
            total: 0
        }
    },
    async mounted() {
        this.load()
    },
    methods: {
        async load() {
            if (this.loading)
                return
            this.loading = true

            const query = this.$route.query
            let options = []
            
            switch (query.sort) {
                case 'oldest':
                    options.push('sort=oldest')
                    break
                case 'number':
                    options.push('sort=noAscending')
                    break
                default:
                    options.push('sort=newest')
            }

            if (query.class)
                options.push(`class=${query.class}`)
            if (query.season)
                options.push(`season=${query.season}`)
            if (query.type)
                options.push(`on_offline=${query.type === 'A' ? 'offline' : 'online'}`)
            if (query.artist) {
                if ((await getArtists()).find(artist => artist.name === query.artist))
                    options.push(`artist=${query.artist}`)
                else
                    options.push(`member=${query.artist}`)
            }

            const res = await fetch(`${this.COSMO_API}/objekt/v1/owned-by/${this.address}?${options.join('&')}`)
            const data = await res.json()
            this.total = data.total
            this.objekts.push(...data.objekts.map(o => Object({
                id: o.collectionId.toLowerCase().replaceAll(' ', '-'),
                thumbnail: o.thumbnailImage,
                number: o.collectionNo,
                serial: o.objektNo,
                textColor: o.textColor
            })))
            this.loading = false
        },
        reset() {
            this.objekts = []
            this.total = 0
            this.load()
        }
    },
    props: {
        address: String
    }
}
</script>

<style scoped>
</style>