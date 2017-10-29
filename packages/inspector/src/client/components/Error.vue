<template>
  <div class="error">
    <h3 class="message">{{ error.message }}</h3>
    <pre class="stack">{{ error.stack }}</pre>
  </div>
</template>

<script>

export default {

  props: ['error'],

}

</script>

<style scoped lang="scss">
@import "~styles/config";

.error {

  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  text-align: left;
  background-color: $color-bg-light;
  padding: 2rem;
  min-width: 0;
  overflow: auto;

  .message {
    font-size: 1.5rem;
    color: red;
    max-width: 600px;
    margin-bottom: 1rem;
  }

  .stack {
    font-size: 1rem;
    opacity: 0.5;
    max-width: 600px;
  }
}
</style>
