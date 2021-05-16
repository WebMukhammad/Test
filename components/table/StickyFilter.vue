<template>
  <div class="header-sticky">
    <div class="header-sticky__row">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: 'StickyFilter'
}
</script>

<style lang="postcss" scoped>
.header-sticky {
  z-index: 3;
  position: sticky;
  top: 0px;
  border-bottom: 1px solid #f3f3f3;
  &__row {
    display: flex;
    padding-bottom: 5px;
    background-color: #f4f4f4;
    padding: 13px 15px;
    border-bottom: 1px solid #f3f3f3;
    border-radius: 4px 4px 0 0;
  }
}
</style>
