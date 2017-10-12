<template lang="html">
  <div class="preview" :class="{ 'is-locked': locked }">
    <error-message :error="error"  v-if="error" />
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
    async renderPreview(){
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
        this.error = err;
        this.chunks = [];
        this.assets = [];
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
