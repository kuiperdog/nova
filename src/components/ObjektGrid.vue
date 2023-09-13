<script setup>
import { RouterLink } from 'vue-router'
import Dropdown from './Dropdown.vue'
import getArtists from '../utils/artists'
import defaultIcon from '@/assets/images/cosmo.png'
</script>

<template>
    <div class="objektGrid">
        <div class="status">
            <h2>{{ total.toLocaleString('en-US') }} results</h2>
            <h3>Sort by</h3>
            <Dropdown @valueChanged="x => selectionChanged('sort', x)" :value="$route.query.sort" :options="[ {value: '', label: 'Newest'}, {value: 'oldest', label: 'Oldest'}, {value: 'number', label: 'Number'} ]"/>
        </div>
        <div class="filters">
            <Dropdown @valueChanged="x => selectionChanged('artist', x)" :value="$route.query.artist" :options="[ ...artists ]"/>
            <Dropdown @valueChanged="x => selectionChanged('season', x)" :value="$route.query.season" :options="[ {value: '', label: 'Any Season'}, {value: 'Atom01', label: 'Atom01'}, {value: 'Binary01', label: 'Binary01'} ]"/>
            <Dropdown @valueChanged="x => selectionChanged('class', x)" :value="$route.query.class" :options="[ {value: '', label: 'Any Class'}, {value: 'First', label: 'First'}, {value: 'Special', label: 'Special'}, {value: 'Welcome', label: 'Welcome'}, {value: 'Double', label: 'Double'}, {value: 'Zero', label: 'Zero'} ]"/>
            <Dropdown @valueChanged="x => selectionChanged('type', x)" :value="$route.query.type" :options="[ {value: '', label: 'Any Type'}, {value: 'A', label: 'Physical'}, {value: 'Z', label: 'Digital'} ]"/>
        </div>
        <slot name="options"></slot>
        <div class="grid">
            <RouterLink class="objekt" v-for="objekt in objekts" :to="'/objekt/' + objekt.id + (objekt.serial ? '/' + objekt.serial : '')">
                <img class="objektThumbnail" :src="objekt.thumbnail">
                <div class="objektNumber" :style="{ 'color': objekt.textColor, 'font-size': fontSize }">
                    <b>{{ objekt.number }}</b>
                    <p class="objektSerial" v-if="objekt.serial">#{{ String(objekt.serial).padStart(5, '0') }}</p>
                </div>
            </RouterLink>
            <span ref="previewSize" /> <span /> <span /> <span /> <span />
        </div>
        <div ref="loader" class="nextPage" :style="{ display: (loading || total > objekts.length) ? 'block' : 'none' }">
            <img class="dots" src="@/assets/icons/dots.svg">
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            artists: [{
                value: '',
                label: 'Any Artist',
                icon: defaultIcon
            }],
            fontSize: 'inherit'
        }
    },
    mounted() {
        const interactions = new IntersectionObserver(this.handleIntersection, { threshold: 1 })
        interactions.observe(this.$refs.loader)

        const resizing = new ResizeObserver(this.handleResize)
        resizing.observe(this.$refs.previewSize)

        getArtists().then(list => {
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
        })
    },
    methods: {
        handleIntersection(entries) {
            if (entries[0].isIntersecting && !this.loading)
                this.$emit('loadNext')
        },
        handleResize(entries) {
            if (entries[0].target === this.$refs.previewSize)
                this.fontSize = entries[0].target.clientWidth * 0.066 + 'px'
        },
        async selectionChanged(parameter, value) {
            const query = { ...this.$route.query }
            query[parameter] = value
            if (!query[parameter])
                delete query[parameter]
            await this.$router.push({ query: query })
            this.$emit('updated')
        }
    },
    props: {
        objekts: {
            type: Array,
            default: []
        },
        total: {
            type: Number,
            default: 0
        },
        loading: {
            type: Boolean,
            default: true
        }
    },
    emits: [
        'loadNext',
        'updated'
    ]
}
</script>

<style scoped>
.objektGrid {
    display: flex;
    gap: 20px;
    flex-direction: column;
    align-items: center;
}

.grid {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(calc(100% / 3 - 20px), 200px), 1fr));
    gap: 20px;
}

.objektThumbnail {
    width: 100%;
}

.objektNumber {
    position: absolute;
    writing-mode: vertical-lr;
    top: 0;
    right: 0;
    font-family: 'Pretendard Bold';
    width: 11%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.objektSerial {
    font-family: 'Dot-Matrix';
    margin-top: 1%;
    margin-left: -1%;
}

.objekt {
    position: relative;
    transition: transform 0.25s ease-in-out;
}

.objekt:hover {
    transform: scale(1.05);
}

.filters, .status {
    width: 100%;
    display: flex;
    gap: 20px;
    align-items: center;
    flex-wrap: wrap;
}

.status h2 {
    flex: 1;
}

.dots {
    width: 50px;
}

@media only screen and (max-width: 500px) {
    .objektGrid, .grid, .filters, .status {
        gap: 10px;
        font-size: .9em;
    }
}
</style>