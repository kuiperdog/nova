<script setup>
import { RouterLink, RouterView } from 'vue-router'
import SearchBar from './components/SearchBar.vue'
</script>

<template>
    <header>
            <nav>
                <img id="appLogo" src="@/assets/images/logo.svg">
                <router-link to="/objekt">Objekts</router-link>
                <router-link :to="{ name: 'gravity' }">Gravity</router-link>
                <router-link to="/bookmarks">Bookmarks</router-link>
                <SearchBar/>
                <router-link to="/info">🚀</router-link>
            </nav>
    </header>

    <router-view class="routerView"/>
    <router-view name="modal"/>
</template>

<style scoped>
header {
    width: 100%;
}

nav {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    padding-left: 15px;
    padding-right: 15px;
    gap: 0px 15px;
    border-bottom: 2px solid #171C20;
}

#appLogo {
    height: 15px;
}

nav a {
    line-height: 50px;
    color: #49565E;
    font-size: 20px;
    font-weight: 500;
    text-decoration: none;
    transition: color .2s, border-color .2s;
    border-bottom: 2px solid #00000000;
    margin-bottom: -2px;
    font-family: 'Halvar Breit Bold';
}

nav > * {
    padding-left: 10px;
    padding-right: 10px;
}

.router-link-active {
    color: #FFFFFF;
    border-bottom-color: #FFFFFF;
}

.routerView {
    width: 100%;
    max-width: 1120px;
    padding: 20px;
}

@media only screen and (max-width: 500px) {
    .routerView {
        padding: 10px;
    }
}
</style>
