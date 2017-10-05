import Vue from 'vue';
import VueSocketio from 'vue-socket.io';
import router from './router';
import store from './store';
import App from '../App.vue';

Vue.use(VueSocketio, '/socket', store);

new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
});
