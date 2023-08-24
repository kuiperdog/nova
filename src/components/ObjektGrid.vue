<script setup>
import { RouterLink } from 'vue-router';
</script>

<template>
    <div class="objektGrid">
        <RouterLink v-for="objekt in objekts" :to="objekt.thumbnail">
            <img class="objektPreview" :src="objekt.thumbnail">
        </RouterLink>
    </div>
</template>

<script>
export default {
    props: ['objekts']
}
</script>

<style scoped>
.objektGrid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(calc(100% / 3 - 20px), 200px), 1fr));
    gap: 20px;
    margin: 20px;
    max-width: 1080px;
}

.objektPreview {
    width: 100%;
    transition: transform 0.25s ease-in-out;
}

.objektPreview:hover {
    transform: scale(1.05);
}
</style>