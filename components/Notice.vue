<template>
  <div :class="['notice', type && `notice_${type}`]">
    <div class="notice__content">
      <slot />
    </div>
    <div class="notice__bg"></div>
  </div>
</template>

<script>
export default {
  name: 'Notice',
  props: {
    /**
     * Поддерживаемые типы
     * @values info, attention
     */
    type: {
      type: String,
      default: null,
      validator: (val) => {
        return ['info', 'attention'].some((el) => el === val)
      }
    }
  }
}
</script>

<style lang="postcss" scoped>
.notice {
  display: flex;
  padding: 21px 28px 24px;
  color: #000;
  background-color: #fff5de;
  border: 2px solid #ffbe2a;
  border-radius: 5px;
  &_info {
    border-color: transparent;
    ^&__bg {
      background-image: svg-load('./icon/warning.svg', fill=#E9D4A6);
    }
  }
  &_attention {
    background-color: #fcf7f6;
    border-color: #e41520;
    ^&__bg {
      background-image: svg-load('./icon/warning.svg', fill=#E30613);
    }
  }
  &__content {
    max-width: 680px;
    width: 100%;
    margin-right: 20px;
  }
  &__bg {
    flex-shrink: 0;
    margin: 7px 0 0 auto;
    width: 81px;
    height: 81px;
    background-image: url('~@/assets/img/icon/warning.svg');
    background-repeat: no-repeat;
    background-size: contain;
  }
}
</style>
