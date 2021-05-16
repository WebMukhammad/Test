<template>
  <div class="dashboard-icon-block">
    <h2 v-if="title" class="h2 dashboard-icon-block__title">{{ title }}</h2>
    <div v-if="subtitle" class="dashboard-icon-block__subtitle">{{ subtitle }}</div>
  </div>
</template>

<script>
export default {
  name: 'DashboardIconBlock',
  props: {
    title: {
      type: String,
      default: null
    },
    subtitle: {
      type: String,
      default: null
    }
  }
}
</script>

<style lang="postcss" scoped>
.dashboard-icon-block {
  background: #ffffff;
  border: 1px solid #e5e5e5;
  overflow: hidden;
  padding: 30px 25px 50px;
  border-radius: 4px;
  background-image: url('~@/assets/img/icon/graph.svg');
  background-repeat: no-repeat;
  background-position: 85% 93%;
  background-size: contain;
  &__title {
    font-size: 40px;
  }
  &__subtitle {
    font-size: 18px;
  }
}
</style>
