<template lang="html">
  <div id="app">
    <splash message="loading components..." v-if="initialising" />
    <split-pane direction="vertical" :opts="{size: 300, min: 200, max: 400, closed: false}" v-else>
      <pane slot="first">
        <component-list :components="components" :component="component" />
      </pane>
      <pane slot="second">
        <splash message="select a component from the left to get started" v-if="!component" />
        <pre v-else>{{ JSON.stringify(component, null, 2) }}</pre>
      </pane>
    </split-pane>
  </div>
</template>

<script>

import Splash from './components/Splash.vue';
import Pane from './components/Pane.vue';
import SplitPane from './components/SplitPane.vue';
import ComponentList from './components/ComponentList.vue';

export default {

  components: {
    Splash, SplitPane, ComponentList, Pane
  },

  data(){
    return {
      error: null,
    }
  },

  computed: {

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
    },

  },

  methods: {
    async loadComponent(){
      if (this.component) {
        await this.$store.dispatch('fetchComponentDetail', this.component.id);
      }
    }
  },

  watch: {

    'component.id': function(){
      this.loadComponent();
    },

    '$store.state.dirty': async function(isDirty){
      if (isDirty) {
        await this.$store.dispatch('fetchComponentList');
        await this.$store.dispatch('fetchComponentDetail', this.component.id);
      }
    },

  },

  mounted(){
    this.loadComponent();
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

</style>
