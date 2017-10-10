import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/:component',
      name: 'component',
      props: true,
      children: [
        {
          path: ':variant',
          name: 'variant',
          props: true
        }
      ]
    }
  ]
});
