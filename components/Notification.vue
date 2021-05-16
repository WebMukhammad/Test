<template>
  <div class="notification">
    <div class="notification__header p b">
      Последние уведомления
      <div v-if="list && list.length" class="icon-bin notification__header-icon" @click="remove"></div>
    </div>
    <div v-if="list && list.length" class="notification__list">
      <div
        v-for="item in list"
        :key="item.id"
        :ref="item.read_at ? null : 'item'"
        :data-id="item.id"
        :class="['notification__item', { notification__item_unread: !item.read_at }]"
      >
        <div class="notification__item-date">{{ getDate(item.created_at) }}</div>
        <div class="notification__row">
          <div v-if="item.title" class="notification__item-title">{{ item.title }}</div>
          <div class="notification__item-desc">{{ item.message }}</div>
        </div>
      </div>
    </div>
    <div v-else class="notification__empty">
      <div class="notification__empty-icon"></div>
      <h5 class="h5 mb-5">Нет новых уведомлений</h5>
      <p class="p">Здесь вы найдете уведомления о важных изменениях</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Notification',
  props: {
    list: {
      type: Array,
      default() {
        return []
      }
    },
    count: {
      type: [String, Number],
      default: null
    }
  },
  data() {
    return {
      arr: []
    }
  },
  mounted() {
    if (this.list?.length && this.$refs.item?.length) {
      this.onNotificationSroll()
    }
  },
  destroyed() {
    if (this.arr?.length) {
      this.$emit('mark', this.arr)
    }
  },
  methods: {
    remove() {
      this.$emit('remove')
    },
    getDate(val) {
      const date = new Date(val)

      return date.toLocaleString('ru-RU', {
        month: 'long',
        day: 'numeric'
      })
    },
    onNotificationSroll() {
      const options = {
        root: null,
        rootMargin: '0px',
        threshold: 1
      }
      const animationObserver = new IntersectionObserver((entries) => {
        entries.map((entry) => {
          const id = entry.target.dataset.id
          if (entry.isIntersecting && !this.arr.includes(id)) {
            this.arr.push(id)
          }
        })
      }, options)
      this.$refs.item.map((el) => animationObserver.observe(el))
    }
  }
}
</script>

<style lang="postcss" scoped>
.notification {
  background: #ffffff;
  box-shadow: 0px 4px 30px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  width: 350px;
  overflow: hidden;
  &__header {
    position: relative;
    text-align: center;
    padding: 9px 33px;
    border-bottom: 1px solid #f3f3f3;
    &-icon {
      position: absolute;
      top: 12px;
      right: 11px;
      cursor: pointer;
    }
  }
  &__list {
    margin-right: -20px;
    padding-right: 20px;
    max-height: 420px;
    overflow-y: scroll;
  }
  &__item {
    padding: 11px 26px;
    border-bottom: 1px solid #f3f3f3;
    &_unread {
      ^^&__row:before {
        content: '';
        position: absolute;
        top: 4px;
        left: -16px;
        width: 8px;
        height: 8px;
        background-color: #2d67fd;
        border-radius: 50%;
      }
    }
    &-date {
      font-size: 11px;
      line-height: 13px;
      color: #818181;
      margin-bottom: 1px;
    }
    &-title {
      font-weight: 500;
      font-size: 14px;
      line-height: 18px;
      margin-bottom: 2px;
    }
    &-desc {
      font-size: 13px;
      line-height: 17px;
    }
  }
  &__row {
    position: relative;
  }
  &__empty {
    height: 295px;
    padding: 57px 40px 40px;
    text-align: center;
    &-icon {
      width: 71px;
      height: 84px;
      background-image: url('~@/assets/img/icon/ghost.svg');
      background-repeat: no-repeat;
      background-position: 50%;
      background-size: contain;
      margin: 0 auto 15px;
    }
  }
}
</style>
