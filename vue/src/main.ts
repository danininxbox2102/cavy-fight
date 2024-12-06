import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)

import Vue3TouchEvents, { type Vue3TouchEventsOptions } from 'vue3-touch-events'

app.use<Vue3TouchEventsOptions>(Vue3TouchEvents, {
  disableClick: false
  // any other global options...
})

app.mount('#app')
