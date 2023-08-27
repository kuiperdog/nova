<script setup>
import { RouterLink } from 'vue-router';
</script>

<template>
    <div class="objektGrid">
        <RouterLink class="objekt" v-for="objekt in objekts" :to="'/objekt/' + objekt.id + (objekt.serial ? '/' + objekt.serial : '')">
            <img class="objektThumbnail" :src="objekt.thumbnail">
            <p class="objektNumber">
                <b>{{ objekt.number }}</b>
                <span class="objektSerial" v-if="objekt.serial" :style="{ color: objekt.textColor }">
                    #{{ String(objekt.serial).padStart(5, '0') }}
                </span>
            </p>
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

.objektThumbnail {
    width: 100%;
}

.objektNumber {
    position: absolute;
    writing-mode: vertical-lr;
    top: 50%;
    left: 89%;
    display: inline-block;
    vertical-align: middle;
    transform: translateY(-50%);
    color: initial;
    font-family: 'Pretendard Bold';
}

.objektSerial {
    font-family: 'Dot-Matrix';
}

.objekt {
    position: relative;
    transition: transform 0.25s ease-in-out;
}

.objekt:hover {
    transform: scale(1.05);
}
</style>