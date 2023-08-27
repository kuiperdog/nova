<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
      <nav>
        <h1>Nova</h1>
        <router-link to="/objekt">Objekts</router-link>
        <router-link to="/gravity">Gravity</router-link>
        <router-link to="/users" :class="{'router-link-active': $route.path.startsWith('/@')}">Users</router-link>
        <router-link to="/bookmarks">Bookmarks</router-link>
        <p style="margin-left: auto;">
          v{{ version }}
          <br>
          by @kuipertwt
        </p>
      </nav>
  </header>

  <router-view/>
  <router-view name="modal"/>
</template>

<script>
export default {
  data() {
    return {
      version: __PACKAGE_VERSION__
    }
  }
}
</script>

<style scoped>
nav {
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;
  padding-left: 15px;
  padding-right: 15px;
  gap: 15px;
  border-bottom: 2px solid #171C20;
} 

nav a {
  height: 100%;
  line-height: 50px;
  color: #49565E;
  font-size: 20px;
  font-weight: 500;
  text-decoration: none;
  transition: color .2s, border-color .2s;
  border-bottom: 2px solid #00000000;
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
</style>
