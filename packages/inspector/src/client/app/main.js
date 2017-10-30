import Vue from 'vue';
import VueSocketio from 'vue-socket.io';
import App from '../App.vue';
import router from './router';
import store from './store';

Vue.use(VueSocketio, '/socket', store);

export default new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {App}
});
