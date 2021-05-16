<template>
  <div class="loader" :style="{ width: width, height: height }"></div>
</template>

<script>
export default {
  props: {
    height: {
      type: String,
      default: '300px'
    },
    width: {
      type: String,
      default: '100%'
    }
  }
}
</script>

<style lang="postcss">
.loader {
  background: url('~@/assets/img/loading.svg') no-repeat center;
}
</style>
