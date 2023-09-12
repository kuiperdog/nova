<script setup>
import ObjektGrid from '../components/ObjektGrid.vue'
import getArtists from '../utils/artists'
</script>

<template>
    <ObjektGrid
        :objekts="collections"
        :total="results"
        :loading="loading"
        @loadNext="load()"
        @updated="reset()"/>
</template>

<script>
export default {
    data() {
        return {
            endCursor: 0,
            results: 0,
            collections: [],
            loading: false
        }
    },
    mounted() {
        this.load()
    },
    methods: {
        async load() {
            if (this.loading)
                return
            this.loading = true

            const query = this.$route.query
            const options = []

            if (this.endCursor > 0)
                options.push('after: "' + this.endCursor + '"')

            switch (query.sort) {
                case 'oldest':
                    options.push('orderBy: timestamp_ASC')
                    break
                case 'number':
                    options.push('orderBy: number_ASC')
                    break
                default:
                    options.push('orderBy: timestamp_DESC')
            }

            const filters = []

            if (query.class)
                filters.push('class_eq: "' + query.class + '"')
            if (query.season)
                filters.push('season_eq: "' + query.season + '"')
            if (query.type)
                filters.push('number_contains: "' + query.type + '"')
            if (query.artist) {
                if ((await getArtists()).find(artist => artist.name === query.artist))
                    filters.push('artists_containsAll: "' + query.artist + '"')
                else
                    filters.push('member_eq: "' + query.artist + '"')
            }

            if (filters)
                options.push('where: {' + filters.join(', ') + '}')

            const res = await fetch(this.SUBSQUID_API, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    query: `
                        query {
                            collectionsConnection(first: 30, ${options.join(', ')}) {
                                totalCount
                                pageInfo {
                                    endCursor
                                }
                                edges {
                                    node {
                                        id
                                        thumbnail
                                        number
                                        textColor
                                    }
                                }
                            }
                        }

                    `
                })
            })

            const json = await res.json()
            const data = json.data.collectionsConnection

            this.endCursor = data.pageInfo.endCursor
            this.results = data.totalCount
            this.collections.push(...data.edges.map(edge => edge.node))
            this.loading = false
        },
        reset() {
            this.collections = []
            this.endCursor = 0
            this.results = 0
            this.load()
        }
    }
}
</script>