<template>
  <div class="hint">
    <div class="hint__wrap-img">
      <img class="hint__img" src="~@/assets/img/icon/bulb.svg" alt="" />
    </div>
    <div class="hint__title">
      {{ title }}
    </div>
    <div class="fz-14 lh-19">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      require: true,
      default: 'Подсказка'
    }
  }
}
</script>

<style lang="postcss" scoped>
.hint {
  position: sticky;
  top: 15px;
  background-color: #fffae5;
  padding: 21px 24px 26px;
  border-radius: 3px;
  &__wrap-img {
    width: 32px;
    height: 32px;
    margin-bottom: 9px;
  }
  &__title {
    font-size: 14px;
    font-weight: 500;
    line-height: 19px;
    margin-bottom: 7px;
  }
}
</style>
