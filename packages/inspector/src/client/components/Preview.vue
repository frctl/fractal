<template lang="html">
  <div class="preview" :class="{ 'is-locked': locked }">
    <div class="toolbar" v-if="engines.length > 1">
      <select class="tplSelector" v-model="$store.state.selected.engine">
        <option class="tplSelector__engine" v-for="engine in engines" :key="engines.name" :value="engine.name">
          {{ engine.label }}
        </option>
      </select>
    </div>
    <error-message :error="error" v-if="error" />
    <iframe class="preview__window" :srcdoc="html" v-else-if="html"></iframe>
    <splash message="use the options panel to select one or more previews" v-else />
  </div>
</template>

<script>

import axios from 'axios';
import eventBus from '../app/events.js';
import Splash from './Splash.vue';
import ErrorMessage from './Error.vue';

let previewIds = [];

export default {

  props: ['component'],

  components: {
    Splash, ErrorMessage
  },

  data(){
    return {
      error: null,
      locked: false,
      chunks: [],
      assets: []
    }
  },

  computed : {

    engines(){
      return this.$store.state.engines;
    },

    selectedEngine(){
      return this.$store.state.selected.engine;
    },

    css(){
      return this.assets.filter(f => f.extname === '.css').map(f => f.contents).join('\n');
    },

    js(){
      return this.assets.filter(f => f.extname === '.js').map(f => f.contents).join('\n');
    },

    html(){
      if (!this.component) {
        return '';
      }
      const markup = this.chunks.join('<br>');
      return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <style>${this.css}</style>
        <title>${this.component.label} | Fractal Inspector</title>
      </head>
      <body>
        ${markup}
        <script>${this.js}</!script>
      </body>
      </html>
      `.replace(/"/g,'\"').replace('!script', 'script');
    },

    previews() {
      if (this.component) {
        return this.$store.getters.getSelectedPreviewsForComponent(this.component.id);
      }
      return [];
    },

    previewIds() {
      return this.previews.map(p => p.id);
    }
  },

  methods: {

    setError(err){
      if (typeof err === 'string') {
        err = new Error(err);
      }
      this.error = err;
      this.chunks = [];
      this.assets = [];
    },

    async renderPreview(){
      if (this.engines.length === 0){
        this.setError(`No view engines registered.`);
        return;
      }
      const hasMatchingView = this.component.views.find(view => {
        return view.engine === this.selectedEngine;
      });
      if (!hasMatchingView){
        const engine = this.engines.find(engine => engine.name === this.selectedEngine);
        this.setError(`No ${engine.label} view available.`);
        return;
      }
      try {
        const [assets, chunks] = await Promise.all([
          axios({
            url: `/_api/inspector/assets/${this.component.id}`,
          }),
          axios({
            method: 'post',
            url: `/_api/render`,
            data: this.previews.map(preview => {
              return {
                engine: this.selectedEngine,
                component: this.component.id,
                variant: preview.originalVariantId,
                context: preview.context
              }
            })
          })
        ]);
        this.error = null;
        this.chunks = chunks.data.map(result => result.output);
        this.assets = assets.data;
      } catch(err) {
        this.setError(err);
      }
    }
  },

  watch: {

    'component.id': function() {
      this.chunks = [];
      this.assets = [];
    },

    previewIds(ids){
      if (JSON.stringify(previewIds) !== JSON.stringify(ids)) {
        this.renderPreview();
        previewIds = ids;
      }
    },

    selectedEngine(){
      this.renderPreview();
    }
  },

  created(){
    eventBus.$on('layoutAdjustStart', () => this.locked = true);
    eventBus.$on('layoutAdjustEnd', () => this.locked = false);
    eventBus.$on('updated', () => this.renderPreview());
  }

}
</script>

<style lang="scss">
@import "~styles/config";

.preview {

  display: flex;
  height: 100%;
  width: 100%;
  overflow: hidden;
  background-color: #fff;
  pointer-events: all;
  flex-direction: column;

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

.toolbar {
  height: 32px;
  border-bottom: 1px solid $color-divider;
  background-color: $color-bg-dark;
  display: flex;
  flex: none;
  align-items: center;
  // width: 100%;
  position: relative;
  padding: 0 5px;
  font-size: 15px;
}

.tplSelector {

  flex: none;
  margin-left: auto;
  width: auto;
  border: 1px solid #ccc;
  font-size: 14px;

  &__engine + &__engine {
    margin-left: 10px;
  }

  label {
    cursor: pointer;
    line-height: 1.0;
  }
}

</style>
