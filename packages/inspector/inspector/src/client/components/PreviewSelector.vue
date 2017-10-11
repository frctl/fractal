<template lang="html">
  <div class="previewSelector">
    <h2 class="previewSelector__title">{{ component.label }}</h2>
    <div class="previewSelector__options">

      <div class="selectorSet" v-for="(variant, index) in variants" :key="variant.id">
        <label class="selectorSet__parent">
          <input type="checkbox" class="selectorSet__input" @change.stop="handleVariantToggle(variant, $event)" :value="variant.id" v-model="$store.state.selected.variants">
          <span class="selectorSet__label">{{ variant.label }}</span>
        </label>
        <div class="selectorSet__children">
          <label v-for="(preview, index) in getPreviewsForVariant(variant)" :key="preview.id" class="selectorSet__child" :style="{display: preview.default ? 'none' : 'block' }">
            <input type="checkbox" class="selectorSet__input" :value="preview.id" v-model="$store.state.selected.previews" @change.stop="handlePreviewToggle(variant, preview)">
            <span class="selectorSet__label">{{ preview.label }}</span>
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {

  props: ['component'],

  computed: {

    variants() {
      return this.$store.getters.getVariantsForComponent(this.component.id);
    },

    previews() {
      return this.$store.getters.getPreviewsForComponent(this.component.id);
    },

    selectedVariants() {
      return this.$store.state.selected.variants;
    },

    selectedPreviews() {
      return this.$store.state.selected.previews;
    }

  },

  methods: {

    getPreviewsForVariant(variant){
      return this.previews.filter(p => p.variant === variant.id);
    },

    handlePreviewToggle(variant, preview) {
      preview.selected = !preview.selected;
      const selected = this.getPreviewsForVariant(variant).filter(p => this.selectedPreviews.includes(p.id));
      if (selected.length === 0) {
        this.$store.state.selected.variants = this.selectedVariants.filter(id => id !== variant.id);
      } else if (!this.selectedVariants.includes(variant.id)){
        this.$store.state.selected.variants.push(variant.id);
      }
    },

    handleVariantToggle(variant, event) {
      const previews = this.getPreviewsForVariant(variant);
      const isActive = event.target.checked;
      if (isActive) {
        previews.forEach(p => {
          if (!this.selectedPreviews.includes(p.id)) {
            this.$store.state.selected.previews.push(p.id);
          }
        });
      } else {
        this.$store.state.selected.previews = this.selectedPreviews.filter(id => {
          return !previews.find(p => p.id === id);
        });
      }
    }

  }

}
</script>

<style lang="scss">
@import "~styles/config";

.previewSelector {

  display: flex;
  flex-direction: column;
  height: 100%;
  flex: auto;
  overflow: auto;

  &__title {
    background-color: #fff;
    border-top: 1px solid $color-divider;
    padding: 10px 1rem;
    font-weight: bold;
  }

}

.selectorSet {

  &__input {
    margin-right: 6px;
  }

  &__parent {
    cursor: pointer;
    padding: 8px 1rem 9px 1rem;
    background-color: $color-bg-dark-darkened;
    border-top: 1px solid $color-divider;
    border-bottom: 1px solid $color-divider;
    display: block;
  }

  &__children {
    background-color: $color-bg-dark;
  }

  &__child {
    cursor: pointer;
    padding: 0 1rem 0 1.5rem;
    margin: 8px;
    display: block;
  }

}
</style>
