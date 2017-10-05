import Vue from 'vue';
import axios from 'axios';
import {remove, sortBy} from 'lodash';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({

  state: {
    socketConnected: false,
    initialised: false,
    loading: true,
    components: [],
    dirty: false
  },

  actions: {

    async initialise({ commit, dispatch }) {
      const response = await dispatch('fetchComponentList');
      commit('initialised', true);
      return response;
    },

    async fetchComponentList({ commit }) {
      commit('loading', true);
      const response = await axios.get('/_api/components');
      commit('setComponents', response.data || []);
      commit('loading', false);
      commit('dirty', false);
      return response;
    },

    async fetchComponentDetail({ commit }, id) {
      commit('loading', true);
      const response = await axios.get(`/_api/components/${id}`);
      commit('setComponent', response.data);
      commit('loading', false);
      return response;
    },
  },

  mutations: {

    SOCKET_CONNECT: (state) => {
      console.log('socket connected!');
      state.socketConnected = true;
    },

    SOCKET_CHANGED: (state) => {
      console.log('client - change detected');
      state.dirty = true;
    },

    loading(state, isLoading = true) {
      state.loading = isLoading;
    },

    dirty(state, isDirty = true) {
      state.dirty = isDirty;
    },

    initialised(state, init = true) {
      state.initialised = init;
    },

    setComponents(state, components) {
      state.components = components;
    },

    setComponent(state, component) {
      remove(state.components, item => item.id === component.id);
      state.components.push(component);
    },

  },

  getters: {

    components(state) {
      return sortBy(state.components, ['label', 'id']);
    },

    getComponent: state => id => {
      return state.components.find(component => component.id === id);
    },
  }

});

export default store;
