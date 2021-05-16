<template>
  <input v-model="inputValue" type="text" class="table-input" :style="'width:' + inputWidth + 'px'" />
</template>

<script>
export default {
  name: 'EditableText',
  props: {
    inputValue: {
      type: String,
      default: ''
    }
  },
  computed: {
    inputWidth() {
      return (this.inputValue.length + 1) * 8
    }
  }
}
</script>

<style lang="postcss" scoped>
.table-input {
  overflow: hidden;
  width: 40px;
  min-width: 35px;
  max-width: 180px;
  height: 17px;
  font-size: 14px;
  line-height: 26px;
  outline: none;
  background-color: inherit;
  border: none;
  border-bottom: 1px dashed #ddd;
}
</style>
