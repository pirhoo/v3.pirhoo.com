import { createApp } from 'vue'
import VueLazyload from 'vue3-lazyload'
import VueMasonryCSS from 'vue-masonry-css'

import App from './components/App.vue'

const app = createApp(App)

app.use(VueLazyload, { lazyComponent: true, preLoad: 1 })
app.use(VueMasonryCSS)

app.mount('#app')
