import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

export const app = createApp(App)

app.config.globalProperties.SUBSQUID_API = 'https://squid.subsquid.io/cosmo/graphql'
app.config.globalProperties.COSMO_API = 'https://api.cosmo.fans'
app.config.globalProperties.POLYGON_RPC = 'https://polygon-rpc.com'

app.use(router)

app.mount('#app')
