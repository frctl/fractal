<template lang="html">
  <div id="app">
    <splash message="loading components..." v-if="initialising" />
    <split-pane direction="vertical" :opts="{size: 300, min: 200, max: 400}" v-else>
      <pane slot="first" class="sidebar">
        <split-pane direction="horizontal" :opts="{pane: 'second', size: appHeight/2, min: appHeight * 0.25, max: appHeight * 0.75}">
          <pane slot="first">
            <component-list :components="components" :component="component" />
          </pane>
          <preview-selector slot="second" :component="component" />
        </split-pane>
      </pane>
      <pane slot="second">
        <error-message :error="error"  v-if="error" />
        <preview :component="component" v-else-if="component" />
        <splash message="select a component from the left to get started" v-else />
      </pane>
    </split-pane>
  </div>
</template>

<script>

import eventBus from './app/events.js';
import Splash from './components/Splash.vue';
import Pane from './components/Pane.vue';
import Preview from './components/Preview.vue';
import SplitPane from './components/SplitPane.vue';
import ComponentList from './components/ComponentList.vue';
import PreviewSelector from './components/PreviewSelector.vue';
import ErrorMessage from './components/Error.vue';

export default {

  components: {
    Splash, SplitPane, ComponentList, Pane, Preview, PreviewSelector, ErrorMessage
  },

  data(){
    return {
      error: null
    }
  },

  computed: {

    appHeight() {
      return window.innerHeight;
    },

    component(){
      if (this.$route.params.component) {
        return this.$store.getters.getComponent(this.$route.params.component);
      }
      return null;
    },

    components() {
      return this.$store.getters.components;
    },

    initialising() {
      return ! this.$store.state.initialised;
    },

    loading() {
      return this.$store.state.loading;
    }
  },

  methods: {
    async loadComponent(){
      if (this.component) {
        await this.$store.dispatch('fetchComponentDetail', this.component.id);
      }
    }
  },

  watch: {

    'component.id': async function(){
      await this.loadComponent();
    },

    '$store.state.dirty': async function(isDirty){
      if (isDirty) {
        await Promise.all([
          this.$store.dispatch('fetchComponentList'),
          this.$store.dispatch('fetchComponentDetail', this.component.id),
        ]);
        eventBus.$emit('updated');
      }
    },
  },

  mounted(){
    this.$store.dispatch('initialise');
  },
}
</script>

<style lang="scss">
@import "~styles/config";
@import "~styles/base";

#app {
  display: flex;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  min-width: 0;
}

.sidebar {
  background: $color-bg-dark;
}

</style>
