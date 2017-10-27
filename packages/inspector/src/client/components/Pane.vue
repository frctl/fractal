<template lang="html">
  <div class="pane">

    <slot></slot>

    <!-- <slot v-if="toolbar === 'bottom'" />

    <toolbar>
      <template slot="actions-left">
        <slot name="toolbar-left" />
      </template>
      <toolbar-tab v-for="panel in panels" :key="panel.name" :target="panel" @selected="selectPanel(panel)" slot="tabs" />
      <template slot="actions-right">
        <slot name="toolbar-right" />
      </template>
    </toolbar>

    <slot v-if="toolbar === 'top'" /> -->

  </div>
</template>

<script>
// import Toolbar from './Toolbar.vue';
// import ToolbarTab from './ToolbarTab.vue';

export default {

  // components: { Toolbar, ToolbarTab },

  // props: {
  //   toolbar: {
  //     default: 'top'
  //   }
  // },
  //
  // data(){
  //   return {
  //     panels: [],
  //   }
  // },
  //
  // methods: {
  //   selectPanel(selected){
  //     this.panels.forEach(panel => {
  //       panel.selected = panel === selected;
  //     });
  //   }
  // },
  //
  // mounted(){
  //   this.panels = this.$children.filter(child => child.type === 'panel');
  //   if (this.panels.length) {
  //     this.panels[0].selected = true;
  //   }
  // }
}
</script>

<style lang="scss">
@import "~styles/config";

.pane {

  display: flex;
  flex-direction: column;
  align-content: stretch;
  height: 100%;
  overflow: auto;


}
</style>
