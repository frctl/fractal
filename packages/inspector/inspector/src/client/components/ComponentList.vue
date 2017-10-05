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
      <component-list-item
        v-for="(item, index) in filteredComponents"
        :key="item.id"
        :component="item"
        :active="item === component" />
    </ul>

  </div>
</template>

<script>
import ComponentListItem from './ComponentListItem.vue';
import fuzzy from 'fuzzysearch';

export default {

  components: { ComponentListItem  },

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
        return component === this.component || fuzzy(this.filter.toLowerCase(), component.id.toLowerCase());
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
  background: $color-bg-dark;

  // overflow: hidden;

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

}

</style>
