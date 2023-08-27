import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.config.globalProperties.SUBSQUID_API = 'https://squid.subsquid.io/cosmo/v/v1/graphql'
app.config.globalProperties.COSMO_API = 'https://api.cosmo.fans'

app.use(router)

app.mount('#app')
