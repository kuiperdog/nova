<script setup>
import Spinner from './Spinner.vue'
</script>

<template>
    <div class="blur" @click.self="$emit('closed')">
        <div class="modal">
            <img @click="$emit('closed')" id="closeBtn" src="@/assets/icons/close.svg">
            <Spinner v-if="!data"/>
            <div class="list" v-if="data" v-for="category in Object.keys(data)">
                <h1 v-if="data[category].length">{{ category }}</h1>
                <div class="gravity" v-for="gravity in data[category]">
                    <RouterLink v-if="gravity.polls.length <= 1" :to="`/gravity/${artist}/${gravity.id}`">
                        <h2>{{ gravity.title }}</h2>
                    </RouterLink>
                    <div v-if="gravity.polls.length > 1">
                        <h2>{{ gravity.title }}</h2>
                        <RouterLink v-for="poll in gravity.polls" :to="`/gravity/${artist}/${gravity.id}/${poll.indexInGravity}`">
                            <h3>{{ poll.title }}</h3>
                        </RouterLink>
                    </div>
                </div>
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
    async mounted() {
        const res = await fetch(`${this.COSMO_API}/gravity/v3/${this.artist}`)
        this.data = await res.json()
    },
    props: {
        artist: String
    },
    emits: ['closed']
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
    border-radius: 20px;
    box-shadow: rgba(0, 0, 0, 0.5) 0px 0px 20px;
    background-color: #171C20;
    overflow: auto;
    cursor: auto;
    width: 400px;
    height: 600px;
    position: relative;
}

.list {
    display: flex;
    gap: 40px;
    flex-direction: column;
    padding: 20px;
}

.list:empty {
    padding: 0;
}

#closeBtn {
    width: 30px;
    position: absolute;
    top: 20px;
    right: 20px;
    cursor: pointer;
}

h1 {
    font-weight: bold;
    text-transform: capitalize;
    font-family: 'Halvar Breit Bold';
}

.gravity {
    white-space: pre-line;
}

a {
    color: inherit;
}

@media only screen and (max-width: 400px) {
    .modal {
        width: 100%;
        height: 100%;
        border-radius: 0;
    }
}
</style>