<template>
  <div class="layout">
    <Header class="layout__header" />
    <Nuxt class="layout__content" />
    <!-- вставлять просто тег script нельзя, потому что nuxt исключает его из шаблона при сборке продакшен-версии, тег просто пропадает  -->
    <component :is="'script'" src="https://livechatv2.chat2desk.com/packs/ie-11-support.js" />
    <component :is="'script'" src="/chat.js" />
  </div>
</template>

<script>
export default {
  middleware: ['tokenCheck'],
  errorCaptured(e) {
    console.log('error was captured', e)
  }
}
</script>

<style lang="postcss" scoped>
body {
  background: #242424;
}

.layout {
  min-height: 100%;
  padding-left: 10px;
  padding-right: 10px;
  background: #242424;
  display: flex;
  flex-direction: column;
  &__header {
    flex-shrink: 0;
  }
  &__content {
    margin-bottom: 10px;
    border-radius: 4px;
    background-color: #fff;
    flex-grow: 1;
  }
}
</style>
