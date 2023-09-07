<script setup>
import { RouterLink } from 'vue-router';
</script>

<template>
    <div class="objektGrid">
        <RouterLink class="objekt" v-for="objekt in objekts" :to="'/objekt/' + objekt.id + (objekt.serial ? '/' + objekt.serial : '')">
            <img class="objektThumbnail" :src="objekt.thumbnail">
            <div class="objektNumber">
                <p :style="{ color: objekt.textColor }">
                    <b>{{ objekt.number }}</b>
                    <span class="objektSerial" v-if="objekt.serial">
                        #{{ String(objekt.serial).padStart(5, '0') }}
                    </span>
                </p>
            </div>
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
    font-size: 50%;
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