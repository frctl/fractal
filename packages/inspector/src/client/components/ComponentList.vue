<template lang="html">
  <div class="components"
    @keyup.up.stop.prevent="goPrev"
    @keyup.down.stop.prevent="goNext">

    <div class="components__filterbox">
      <input class="components__filter"
        ref='filterBox'
        v-model="filter"
        @keyup.esc="clearFilter"
        placeholder="Filter components..." autofocus>
    </div>

    <ul class="components__list">
      <li class="components__component" :class="{ 'is-selected': item === component }" v-for="(item, index) in filteredComponents" :key="item.id">
        <h3 class="components__label">
          <router-link :to="{ name: 'component', params: {component: item.id} }">{{ item.label }}</router-link>
        </h3>
      </li>
    </ul>

  </div>
</template>

<script>

import fuzzy from 'fuzzysearch';

export default {

  props: ['component', 'components'],

  data() {
    return {
      filter: ''
    }
  },

  computed: {

    activePos(){
      for (let i = 0; i < this.filteredComponents.length; i++) {
        if (this.component === this.filteredComponents[i]) {
          return i;
        }
      }
      return false;
    },

    filteredComponents(){
      if (this.filter.trim() === '') {
        return this.components;
      }
      return this.components.filter(component => {
        return component === this.component || fuzzy(this.filter.toLowerCase(), component.label.toLowerCase());
      });
    }

  },

  methods: {

    clearFilter(){
      this.filter = '';
    },

    focusFilter(){
      this.$refs.filterBox.focus();
    },

    goPrev(){
      const prevPos = this.activePos > 0 ? this.activePos - 1 : this.filteredComponents.length -1;
      const prev = this.filteredComponents[prevPos];
      this.$router.push({ name: 'component', params: { component: prev.id }});
    },

    goNext(){
      const nextPos = this.activePos < this.filteredComponents.length - 1 ? this.activePos + 1 : 0;
      const next = this.filteredComponents[nextPos];
      this.$router.push({ name: 'component', params: { component: next.id }});
    }

  },

  watch: {
    component(){
      this.focusFilter();
    }
  },

  mounted(){
    this.focusFilter();
  }
}

</script>


<style lang="scss">
@import "~styles/config";

.components {
  display: flex;
  flex-direction: column;
  height: 100%;
  display: flex;
  flex: auto;

  a {
    text-decoration: none;
  }

  &__filterbox {
    display: flex;
    height: 32px;
    background-color: #fff;
    width: 100%;
    flex: none;
    position: relative;
    border-bottom: 1px solid $color-divider;

  }

  &__filter {
    background-color: #fff;
    border: 0;
    width: 100%;
    padding: 0 1rem;
    height: 100%;
    font-size: 14px;
    outline: none;
    &:focus {
      outline: none;
    }
  }

  &__list {
    display: flex;
    flex-direction: column;
    overflow: auto;
  }

  &__component {

    position: relative;
    border-top: 1px solid transparent;
    border-bottom: 1px solid transparent;

    &.is-selected {
      position: relative;
      z-index: 2;
      background-color: #eee;
    }

  }

  &__label {
    font-size: 1rem;
    a {
      color: #333;
      display: block;
      padding: 8px 1rem 6px 1rem;
    }
  }

  &__component.is-selected &__label {
    font-weight: bold;
  }
}

</style>
