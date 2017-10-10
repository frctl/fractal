<template>
  <div class="split-pane" @mousemove="dragMove" @mouseup="dragEnd" @mouseleave="dragEnd" :class="wrapperClasses">
    <div class="split-pane__pane split-pane__pane--first" :style="styles.first" :class="{'is-closed': pane === 'first' && closed}">
      <slot name="first"></slot>
    </div>
    <div class="split-pane__handle" @mousedown.prevent="dragStart" :style="styles.handle">
    </div>
    <div class="split-pane__pane split-pane__pane--second" :style="styles.second" :class="{'is-closed': pane === 'second' && closed}">
      <slot name="second"></slot>
    </div>
  </div>
</template>

<script>

import eventBus from '../app/events.js';

export default {
  props: {
    direction: {
      default: 'vertical'
    },
    opts: {
      default(){
        return {}
      }
    }
  },

  data () {
    return {
      pane: 'first',
      size: 300,
      max: null,
      min: null,
      closed: false,
      dragging: false
    }
  },

  computed: {
    styles(){
      const dimension = this.direction === 'horizontal' ? 'height' : 'width';
      const position = this.direction === 'horizontal' ? 'top' : 'left';
      const fixedSize = this.size + 'px';
      const fluidSize = `calc(100% - ${fixedSize})`;
      const fixed = this.pane;
      return {
        first: { [dimension]: fixed === 'first' ? fixedSize : fluidSize },
        second: { [dimension]: fixed === 'second' ? fixedSize : fluidSize },
        handle: { [position]: `calc(${fixed === 'first' ? fixedSize : fluidSize} - 5px)`, 'display': this.closed ? 'none' : 'block' }
      }
    },

    wrapperClasses(){
      return {
        'is-dragging': this.dragging,
        'fixed-first': this.pane === 'first',
        'fixed-second': this.pane === 'second',
        'split-pane--horizontal': this.direction === 'horizontal',
        'split-pane--vertical': this.direction === 'vertical'
      }
    }
  },

  methods: {
    toggle(pane){
      this.closed = !this.closed;
    }
  },

  watch: {
    split(val) {
      this.currentSplit = val;
    }
  },

  methods: {

    dragStart (e) {
      this.dragging = true;
      this.$emit('dragStart');
      eventBus.$emit('layoutAdjustStart');
      if (this.direction === 'horizontal') {
        this.startY = e.pageY;
      } else {
        this.startX = e.pageX;
      }
      this.startSplit = this.size;
    },

    dragMove (e) {
      if (this.dragging) {
        let size;
        if (this.direction === 'horizontal') {
          const dy = e.pageY - this.startY;
          size = this.pane === 'first' ? this.startSplit + dy : this.startSplit - dy;
        } else {
          const dx = e.pageX - this.startX;
          size = this.pane === 'first' ? this.startSplit + dx : this.startSplit - dx;
        }
        if (this.max && size > this.max) {
          this.size = this.max;
        } else if (this.min && size < this.min) {
          this.size = this.min;
        } else {
          this.size = size;
        }
      }
    },

    dragEnd () {
      this.dragging = false;
      this.$emit('dragEnd', {split: this.size});
      eventBus.$emit('layoutAdjustEnd', {split: this.size});
    }
  },

  mounted() {
    this.pane = this.opts.pane || this.pane;
    this.min = this.opts.min || this.min;
    this.max = this.opts.max || this.max;
    this.closed = this.opts.closed || this.closed;
  },

  watch: {
    'opts.closed': function(closed){
      this.closed = closed;
    }
  }
}
</script>

<style lang="scss">

@import "~styles/config";

.split-pane {

  display: flex;
  height: 100%;
  width: 100%;
  position: relative;

  &__pane {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    flex: auto;
  }

  &__pane.is-closed {
    width: 0 !important;
    min-width: 0 !important;
    display: none;
  }

  &__pane.is-full {
    width: 100% !important;
    max-width: 100% !important;
  }

  &__handle {
    position: absolute;
    z-index: 99;
    &:after {
      content: '';
      display: block;
      position: absolute;
      background-color: $color-divider;
    }
  }

  &--horizontal {
    flex-direction: column;
  }

  &--horizontal.is-dragging {
    cursor: ns-resize;
  }

  &--horizontal > &__pane {
    width: 100%;
  }

  &--horizontal > &__handle {
    left: 0;
    right: 0;
    height: 10px;
    cursor: ns-resize;
    &:after {
      top: 5px;
      width: 100%;
      left: 0;
      right: 0;
      height: 1px;
    }
  }

  &--vertical {
    flex-direction: row;
  }

  &--vertical.is-dragging {
    cursor: ew-resize;
  }

  &--vertical > &__pane {
    height: 100%;
  }

  &--vertical > &__handle {
    top: 0;
    bottom: 0;
    width: 10px;
    cursor: ew-resize;
    &:after {
      left: 4px;
      height: 100%;
      top: 0;
      bottom: 0;
      width: 1px;
    }
  }
}

</style>
