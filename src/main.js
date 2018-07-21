import Vue from 'vue';
import store from './store';
import App from './components/App.vue';
import FontAwesomeIcon from './components/FontAwesomeIcon';


Vue.component('fa', FontAwesomeIcon);
Vue.config.productionTip = false;

new Vue({
  store,
  render: h => h(App),
}).$mount('#app');
