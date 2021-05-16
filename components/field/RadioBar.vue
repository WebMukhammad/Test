<template>
  <div class="filters">
    <button
      v-for="item in list"
      :key="item.value"
      :class="['filters__button', { filters__button_active: active === item.value }]"
      @click="onClick(item.value)"
    >
      <slot :data="item">
        {{ item.name }}
      </slot>
    </button>
  </div>
</template>

<script>
import scrollIntoView from 'smooth-scroll-into-view-if-needed'
export default {
  name: 'RadioBar',
  props: {
    list: {
      type: Array,
      default() {
        return []
      }
    },
    scrollToSelector: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      active: this.$route.query.state || 'all',
      itemVal: null
    }
  },
  methods: {
    onClick(val) {
      if (this.scrollToSelector) {
        const $el = document.querySelector(this.scrollToSelector)
        scrollIntoView($el, {
          behavior: 'smooth',
          block: 'start'
        })
      }
      if (this.active !== val) {
        this.active = val
        this.$emit('change', val)
      }
    }
  }
}
</script>

<style lang="postcss" scoped>
.filters {
  display: flex;
  flex-grow: 1;
  flex-shrink: 0;
  font-size: 14px;
  line-height: 16px;
  &__button {
    background-color: #f4f4f4;
    border: 1px solid #e5e5e5;
    border-left: none;
    padding: 11px;
    cursor: pointer;
    outline: none;
    flex-shrink: 0;
    &:first-child {
      border-left: 1px solid #e5e5e5;
      border-radius: 3px 0 0 3px;
    }
    &:last-child {
      border-radius: 0 3px 3px 0;
    }
    &_active {
      background-color: #fff;
      color: #e30614;
    }
  }
  @media (max-width: 1400px) {
    &__button {
      padding-left: 7px;
      padding-right: 7px;
    }
  }
}
</style>
