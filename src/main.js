import Vue from 'vue';
import VueMasonry from 'vue-masonry-css';

import App from './components/App.vue';
import FontAwesomeIcon from './components/FontAwesomeIcon';

Vue.use(VueMasonry);
Vue.component('fa', FontAwesomeIcon);
Vue.config.productionTip = false;

new Vue({ render: h => h(App) }).$mount('#app');
