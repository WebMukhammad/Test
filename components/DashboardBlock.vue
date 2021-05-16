<template>
  <div class="dashboard-block">
    <h5 v-if="title || $scopedSlots.title" class="h5 dashboard-block__title">
      <slot name="title">{{ title }}</slot>
    </h5>
    <div v-if="content || $scopedSlots.content" class="dashboard-block__desc p">
      <slot name="content">{{ content }}</slot>
    </div>
    <slot />
  </div>
</template>

<script>
export default {
  name: 'DashboardBlock',
  props: {
    title: {
      type: String,
      default: null
    },
    content: {
      type: String,
      default: null
    }
  }
}
</script>

<style lang="postcss" scoped>
.dashboard-block {
  background: #ffffff;
  border: 1px solid #e5e5e5;
  overflow: hidden;
  padding: 20px;
  border-radius: 4px;
  height: 100%;
  &__title {
    font-size: 18px;
    margin-bottom: 17px;
  }
}
</style>
