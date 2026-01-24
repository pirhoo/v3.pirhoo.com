import { createApp } from 'vue'
import VueLazyload from 'vue3-lazyload'
import VueMasonryCSS from 'vue-masonry-css'

import App from './components/App.vue'
import FontAwesomeIcon from './components/FontAwesomeIcon'

const app = createApp(App)

app.use(VueLazyload, { lazyComponent: true, preLoad: 1 })
app.use(VueMasonryCSS)
app.component('Fa', FontAwesomeIcon)

app.mount('#app')
