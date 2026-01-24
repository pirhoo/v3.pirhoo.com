import { createApp } from 'vue'
import VueLazyload from 'vue3-lazyload'

import App from './components/App.vue'

const app = createApp(App)

app.use(VueLazyload, { lazyComponent: true, preLoad: 1 })

app.mount('#app')
