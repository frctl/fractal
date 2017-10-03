<template lang="html">
  <div id="app">
    <splash message="loading components..." v-if="loading" />
    <div class="temp" v-else>
      {{ components.length }} components found
    </div>
  </div>
</template>

<script>

import Splash from './components/Splash.vue';

export default {

  components: {
    Splash
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

    loading() {
      return ! this.$store.state.initialised;
    },

  },

  methods: {

  },

  watch: {


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

.temp {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  font-size: 20px;
  color: #666;
}

</style>
