<template lang="html">
  <div class="preview" :class="{ 'is-locked': locked }">
    <iframe class="preview__window" :srcdoc="code"></iframe>
  </div>
</template>

<script>

import eventBus from '../app/events.js';

export default {

  props: ['code'],

  data(){
    return {
      locked: false
    }
  },

  created(){
    eventBus.$on('layoutAdjustStart', () => this.locked = true);
    eventBus.$on('layoutAdjustEnd', () => this.locked = false);
  }

}
</script>

<style lang="scss">
.preview {

  display: flex;
  height: 100%;
  background-color: #fff;
  pointer-events: all;

  &__window {
    flex: none;
    border: 0;
    height: 100%;
    width: 100%;
    overflow: auto;
  }

  &.is-locked {
    pointer-events: none;
  }

}
</style>
