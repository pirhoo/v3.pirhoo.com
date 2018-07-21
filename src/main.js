import Vue from 'vue';
import App from './App.vue';
import store from './store';
import FontAwesomeIcon from './components/FontAwesomeIcon';

// Font Awesome component must be available everywhere
Vue.component('fa', FontAwesomeIcon);

Vue.config.productionTip = false;

new Vue({
  store,
  render: h => h(App),
}).$mount('#app');
