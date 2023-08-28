<script setup>
import ObjektGrid from '../components/ObjektGrid.vue'
import Dropdown from '../components/Dropdown.vue'
import defaultIcon from '@/assets/images/cosmo.png'
import getArtists from '../utils/artists.js'
</script>

<template>
    <div id="objektView">
        <div id="status">
            <h2>{{ results.toLocaleString('en-US') }} results</h2>
            <h3>Sort by</h3>
            <Dropdown @valueChanged="x => update('sort', x)" :options="[ {value: '', label: 'Newest'}, {value: 'oldest', label: 'Oldest'}, {value: 'number', label: 'Number'} ]"/>
        </div>
        <div id="filters">
            <Dropdown @valueChanged="x => update('artist', x)" :value="$route.query.artist" :options="artists"/>
            <Dropdown @valueChanged="x => update('season', x)" :value="$route.query.season" :options="[ {value: '', label: 'Any Season'}, {value: 'Atom01', label: 'Atom01'}, {value: 'Binary01', label: 'Binary01'} ]"/>
            <Dropdown @valueChanged="x => update('class', x)" :value="$route.query.class" :options="[ {value: '', label: 'Any Class'}, {value: 'First', label: 'First'}, {value: 'Special', label: 'Special'}, {value: 'Welcome', label: 'Welcome'}, {value: 'Double', label: 'Double'}, {value: 'Zero', label: 'Zero'} ]"/>
            <Dropdown @valueChanged="x => update('type', x)" :value="$route.query.type" :options="[ {value: '', label: 'Any Type'}, {value: 'A', label: 'Physical'}, {value: 'Z', label: 'Digital'} ]"/>
        </div>
        <ObjektGrid :objekts='collections'></ObjektGrid>
        <div ref="loader" id="nextPage" :style="{ display: (loading || hasNext) ? 'block' : 'none' }">
            <img id="dots" src="@/assets/icons/dots.svg">
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            hasNext: false,
            endCursor: 0,
            results: 0,
            collections: [],
            artists: [{
                value: '',
                label: 'Any Artist',
                icon: defaultIcon
            }],
            loading: true
        }
    },
    async mounted() {
        if (this.artists.length <= 1) {
            const list = await getArtists()
            for (const artist of list) {
                this.artists.push({
                    value: artist.name,
                    label: artist.title,
                    icon: artist.logoImageUrl,
                    member: false
                }, ...artist.members.map(member => Object({
                    value: member.name,
                    label: member.name,
                    icon: member.profileImageUrl,
                    member: true
                })))
            }
        }
        this.load()

        const observer = new IntersectionObserver(this.handleIntersection, { threshold: 1 })
        observer.observe(this.$refs.loader)
    },
    methods: {
        load() {
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
                if (this.artists.find(artist => artist.value === query.artist).member)
                    filters.push('member_eq: "' + query.artist + '"')
                else
                    filters.push('artists_containsAll: "' + query.artist + '"')
            }

            if (filters)
                options.push('where: {' + filters.join(', ') + '}')

            fetch(this.SUBSQUID_API, {
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
                                    hasNextPage
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
            }).then(async (res) => {
                const json = await res.json()
                const data = json.data.collectionsConnection

                this.loading = false
                this.endCursor = data.pageInfo.endCursor
                this.hasNext = data.pageInfo.hasNextPage
                this.results = data.totalCount
                this.collections.push(...data.edges.map(edge => edge.node))
            })
        },
        async update(parameter, value) {
            const query = { ...this.$route.query }
            query[parameter] = value
            if (!query[parameter])
                delete query[parameter]
            await this.$router.push({ path: 'objekt', query: query })

            this.collections = []
            this.endCursor = 0
            this.hasNext = false
            this.results = 0
            this.loading = true
            this.load()
        },
        handleIntersection(entries) {
            if (entries[0].isIntersecting && this.hasNext && !this.loading) {
                this.loading = true
                this.load()
            }
        }
    }
}
</script>

<style scoped>
#objektView {
    display: flex;
    align-items: center;
    flex-direction: column;
    margin: 20px;
    gap: 20px;
}

#filters, #status {
    width: 100%;
    max-width: 1080px;
    display: flex;
    gap: 20px;
    align-items: center;
}

#status h2 {
    flex: 1;
}

#dots {
    width: 50px;
}
</style>