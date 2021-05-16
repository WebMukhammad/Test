<template>
  <div class="info-block" :style="{ width: width, height: height }">
    <slot name="icon">
      <div
        v-if="icon"
        class="info-block__icon"
        :class="{ [`info-block__icon_${icon}`]: icon }"
        :style="{ width: iconWidth, height: iconHeight }"
      />
    </slot>
    <h5 v-if="title || $scopedSlots.title" class="h5 mb-8">
      <slot name="title">{{ title }}</slot>
    </h5>
    <p v-if="description || $scopedSlots.description" class="info-block__desc p">
      <slot name="description">{{ description }}</slot>
    </p>
    <slot />
  </div>
</template>

<script>
export default {
  name: 'InfoBlock',
  props: {
    icon: {
      type: String,
      default: null,
      validator: (val) => {
        return ['loading'].some((el) => el === val)
      }
    },
    width: {
      type: String,
      default: null
    },
    height: {
      type: String,
      default: null
    },
    iconHeight: {
      type: String,
      default: null
    },
    iconWidth: {
      type: String,
      default: null
    },
    title: {
      type: String,
      default: null
    },
    description: {
      type: String,
      default: null
    }
  }
}
</script>

<style lang="postcss" scoped>
.info-block {
  background: #ffffff;
  box-shadow: 0px 4px 30px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  width: 350px;
  overflow: hidden;
  padding: 15px;
  text-align: center;
  &__icon {
    width: 45px;
    height: 45px;
    margin: auto;
    margin-bottom: 7px;
    background-image: url('~@/assets/img/loading.svg');
    background-repeat: no-repeat;
    background-position: 50%;
    background-size: contain;
  }
}
</style>
