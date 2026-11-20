import '@fontsource-variable/inter'
import '@fontsource-variable/jetbrains-mono'
import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'

createApp(App).use(router).mount('#app')