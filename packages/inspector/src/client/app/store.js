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
    variants: [],
    previews: [],
    engines: [],
    selected: {
      variants: [],
      previews: [],
      engine: null
    },
    dirty: false
  },

  actions: {

    async initialise({commit, dispatch}) {
      commit('loading', true);
      const responses = Promise.all([
        await dispatch('fetchComponentList'),
        await dispatch('fetchProjectInfo')
      ]);
      commit('initialised', true);
      commit('loading', false);
      return responses;
    },

    async fetchComponentList({commit, state}) {
      const response = await axios.get('/_api/components');
      commit('setEntities', {components: response.data || [], initialised: state.initialised});
      commit('dirty', false);
      return response;
    },

    async fetchProjectInfo({commit, state}){
      const response = await axios.get('/_api');
      commit('setEngines', response.data.fractal.engines || []);
      return response;
    },

    async fetchComponentDetail({commit}, id) {
      const response = await axios.get(`/_api/components/${id}`);
      commit('setComponent', response.data);
      return response;
    }
  },

  mutations: {

    SOCKET_CONNECT: state => {
      // console.log('socket connected!');
      state.socketConnected = true;
    },

    SOCKET_CHANGED: (state, details) => {
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

    setEngines(state, engines){
      state.engines = engines;
      if (engines.length) {
        state.selected.engine = engines[0].name;
      }
    },

    setEntities(state, {components, initialised}) {
      // TODO: split this up a bit
      state.components = components;
      const previews = [];
      const variants = [];
      for (const component of components) {
        for (const variant of component.variants) {
          const variantId = `${component.id}.${variant.id}`;
          variants.push(Object.assign({}, variant, {
            id: variantId,
            component: component.id
          }));
          if (variant.scenarios.length === 0) {
            const id = `${variantId}.default`;
            previews.push({
              id,
              component: component.id,
              variant: variantId,
              originalVariantId: variant.id,
              label: 'default',
              default: true,
              context: {}
            });
          } else {
            for (const scenario of variant.scenarios) {
              const id = `${variantId}.${scenario.id}`;
              previews.push({
                id,
                component: component.id,
                variant: variantId,
                originalVariantId: variant.id,
                label: scenario.label || scenario.id,
                context: scenario.context || {}
              });
            }
          }
        }
      }
      if (initialised) {
        // remove any selections that are no longer valid
        state.selected.variants = state.selected.variants.filter(id => variants.find(v => v.id === id));
        state.selected.previews = state.selected.previews.filter(id => previews.find(p => p.id === id));

        // new variants default to being selected in the UI
        variants.forEach(v => {
          if (!state.variants.find(existing => existing.id === v.id)) {
            state.selected.variants.push(v.id);
          }
        });

        // new previews default to being selected if their variant is selected
        previews.forEach(p => {
          if (!state.previews.find(existing => existing.id === p.id) && state.selected.variants.includes(p.variant)) {
            state.selected.previews.push(p.id);
          }
        });

        // if any variants have all previews unselected, then unselect them
        variants.forEach(v => {
          const previewIds = previews.filter(p => p.variant === v.id).map(p => p.id);
          const hasSelectedPreviews = state.selected.previews.find(id => previewIds.includes(id));
          if (!hasSelectedPreviews) {
            state.selected.variants = state.selected.variants.filter(id => v.id !== id);
          }
        });
      } else {
        state.selected.variants = variants.map(v => v.id);
        state.selected.previews = previews.map(p => p.id);
      }
      state.previews = previews;
      state.variants = variants;
    },

    setComponent(state, component) {
      remove(state.components, item => item.id === component.id);
      state.components.push(component);
    }

  },

  getters: {

    components(state) {
      return sortBy(state.components, ['label', 'id']);
    },

    getComponent: state => id => {
      return state.components.find(component => component.id === id);
    },

    getVariantsForComponent: state => componentId => {
      return state.variants.filter(v => v.component === componentId);
    },

    getPreviewsForComponent: state => componentId => {
      return state.previews.filter(p => p.component === componentId);
    },

    getSelectedPreviewsForComponent: state => componentId => {
      return state.previews.filter(p => p.component === componentId).filter(p => {
        return state.selected.previews.includes(p.id);
      });
    }

  }

});

export default store;
