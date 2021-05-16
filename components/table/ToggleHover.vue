<template>
  <div ref="toggleParent" :class="isParentActive ? toggleParentClass : ''">
    <slot />
  </div>
</template>

<script>
import hoverintent from 'hoverintent'

export default {
  name: 'ToggleHover',
  props: {
    event: {
      type: String,
      default: 'hover'
    },
    toggleParentClass: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      $hoverintent: null,
      isParentActive: false
    }
  },
  mounted() {
    if (this.event === 'hover') {
      this.$hoverintent = hoverintent(this.$refs.toggleParent, this.onMouseOver, this.onMouseOut)
    }
  },
  beforeDestroy() {
    if (this.$hoverintent) {
      this.$hoverintent.remove()
    }
  },
  methods: {
    onClick() {
      this.isParentActive = !this.isParentActive
    },
    onMouseOver() {
      this.isParentActive = true
    },
    onMouseOut() {
      this.isParentActive = false
    }
  }
}
</script>

<style lang="postcss"></style>
