import Vue from 'vue';
import VueLazyload from 'vue-lazyload';
import VueMasonry from 'vue-masonry-css';


import App from './components/App.vue';
import FontAwesomeIcon from './components/FontAwesomeIcon';

Vue.use(VueLazyload, { lazyComponent: true, preLoad: 1 });
Vue.use(VueMasonry);
Vue.component('fa', FontAwesomeIcon);
Vue.config.productionTip = false;

new Vue({ render: h => h(App) }).$mount('#app');
