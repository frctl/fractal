<template lang="html">
  <li class="component" :class="{ 'is-selected': active }">
    <h3 class="component__label">
      <router-link :to="{ name: 'component', params: {component: component.id} }">{{ component.label }}</router-link>
    </h3>
    <!-- <ul class="component__previews" v-if="previews.length > 1">
      <li class="component__preview" v-for="item in previews" :class="{ 'is-selected': item === false }">
        <router-link :to="{ name: 'preview', params: {component: component.id, preview: item.id} }">{{ item.label }}</router-link>
      </li>
    </ul> -->
  </li>
</template>

<script>
export default {

  props: ['component', 'active'],

  computed: {
    previews(){
      return this.component.variants || []; // TODO
    }
  }

}
</script>

<style lang="scss">
@import "~styles/config";

.component {

  position: relative;
  border-top: 1px solid transparent;
  border-bottom: 1px solid transparent;
  border-left: 3px solid transparent;

  &__label {
    font-size: 1rem;
    a {
      color: #333;
      display: block;
      padding: 8px 1rem 6px calc(1rem - 3px);
    }
  }

  &__label:hover,
  &.is-selected &__label,
  &__preview:hover,
  &__preview.is-selected {
    a {
      opacity: 1.0;
    }
  }

  &__previews {
    padding: 0 0.5rem 5px 0.5rem;
    display: none;
  }

  &__preview a {
    color: #333;
    display: block;
    padding: 2px 4px 2px 10px;
    font-size: 14px;
  }

  &.is-selected {
    border-left: 3px solid $color-brand;
    position: relative;
    z-index: 2;
    background-color: #eee;
  }

  &.is-selected &__label {
    font-weight: bold;
  }

  &.is-selected:first-child {
    border-top-color: transparent;
  }

  &.is-selected &__previews {
    display: block;
  }

  &__preview.is-selected {
    font-weight: bold;
  }

}


</style>
