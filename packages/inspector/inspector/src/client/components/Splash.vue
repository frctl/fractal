<template>
  <div class="splash">
    <p class="message">{{ message }}</p>
  </div>
</template>

<script>

export default {

  props: ['message'],

}

</script>

<style scoped lang="scss">
@import "~styles/config";

.splash {

  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  background-color: $color-bg-light;

  .message {
    font-size: 1.5rem;
    opacity: 0.5;
  }
}
</style>
