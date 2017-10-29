<template lang="html">
  <div class="previewSelector">
    <h2 class="previewSelector__title">{{ component.label }}</h2>
    <!-- <div class="tplSelector previewSelector__options">
      <h3 class="previewSelector__subTitle">Templates</h3>
      <label class="tplSelector__engine" v-for="(engine, index) in engines" :key="engines.name">
        <input type="checkbox" class="tplSelector__input" :value="engine.name" v-model="$store.state.selected.engines">
        <span class="tplSelector__label">{{ engine.label }}</span>
      </label>
    </div> -->
    <div class="previewSelector__options">
      <h3 class="previewSelector__subTitle">Variants/Scenarios</h3>
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
    },

    selectedEngines() {
      return this.$store.state.selected.engines;
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

  &__subTitle {
    text-transform: uppercase;
    font-size: 0.85rem;
    letter-spacing: 1px;
    padding: 16px 1rem 10px 1rem;
    opacity: 0.7;
  }

  &__options + &__options {
    // margin-top: 0.5rem;
  }

  label {
    display: block;
    cursor: pointer;
  }

}

// .tplSelector {
//
//   border-top: 1px solid $color-divider;
//
//   &__engine {
//     background-color: $color-bg-dark-darkened;
//     padding: 8px 1rem 8px 1rem;
//     border-top: 1px solid $color-divider;
//     &:last-child {
//       border-bottom: 1px solid $color-divider;
//     }
//   }
//
//
//   &__input {
//     margin-right: 6px;
//   }
//
//   &__label {
//
//   }
//
// }

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
  }

  &__children {
    background-color: $color-bg-dark;
  }

  &__child {
    padding: 0 1rem 0 1.5rem;
    margin: 8px;
  }

}
</style>
