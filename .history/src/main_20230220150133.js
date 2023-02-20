import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import './assets/main.css'
import Vue3Toasity from 'vue3-toastify';
// import '@/assets/scss/toastify/index.scss';

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(Vue3Toasity)
app.mount('#app')
