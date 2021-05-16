<template>
  <div>
    <slot
      :list="list"
      :count="count"
      :remove="remove"
      :mark="mark"
      :success="success"
      :error="!!$fetchState.error"
      :pending="$fetchState.pending"
    />
  </div>
</template>

<script>
export default {
  name: 'NotificationData',
  async fetch() {
    this.list = await this.$api.notification.get()
    this.getCount()
    this.success = true
  },
  data() {
    return {
      list: [],
      count: null,
      success: false
    }
  },
  methods: {
    async remove() {
      try {
        await this.$api.notification.remove()
        this.list = []
      } catch (e) {
        console.log('При отправке данных произошла ошибка', e)
      }
    },
    async mark(arr) {
      try {
        await this.$api.notification.mark({ arr })
        this.getCount()
      } catch (e) {
        console.log('При отметке товаров', e)
      }
    },
    async getCount() {
      this.count = (await this.$api.notification.getCount())?.['unread-count']
      this.$store.commit('user/setNotificationCount', this.count)
    }
  }
}
</script>
