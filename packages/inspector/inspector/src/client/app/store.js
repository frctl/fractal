import Vue from 'vue';
import axios from 'axios';
import {remove, sortBy} from 'lodash';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({

  state: {
    initialised: false,
    loading: true,
    components: [],
  },

  actions: {

    async initialise({ commit, dispatch }) {
      const response = await dispatch('fetchComponentList');
      commit('initialised', true);
      return response;
    },

    async fetchComponentList({ commit }) {
      commit('loading', true);
      const response = await axios.get('/api/components');
      commit('setComponents', response.data || []);
      commit('loading', false);
      return response;
    },

    async fetchComponentDetail({ commit }, id) {
      commit('loading', true);
      const response = await axios.get(`/api/components/${id}`);
      commit('setComponent', response.data);
      commit('loading', false);
      return response;
    },
  },

  mutations: {

    loading(state, isLoading = true) {
      state.loading = isLoading;
    },

    initialised(state, init = true) {
      state.initialised = init;
    },

    setComponents(state, components) {
      state.components = components;
    },

    setComponent(state, component) {
      remove(state.components, item => item.name === component.name);
      state.components.push(component);
    },

  },

  getters: {

    components(state) {
      return sortBy(state.components, ['label', 'name']);
    },

    getComponent: state => name => {
      return state.components.find(component => component.name === name);
    },
  }

});

export default store;
