<template>
  <FormElement :title="`${name}:`">
    <Select v-if="type === 'select'" :value="getValueData(id, val)" :data="convertToArray(values)" @change="onChangeSelect" />
    <Select
      v-else-if="type === 'multiple'"
      multiple
      :value="getValueFromDataMultiple(id, val)"
      :data="convertToArray(values)"
      @change="onChangeMultipleSelect"
    />
    <InputText v-else :value="getValueData(id, val)" @input="onInput" />
  </FormElement>
</template>

<script>
import { FormElement, InputText, Select } from '...'

export default {
  components: {
    FormElement,
    InputText,
    Select
  },
  model: {
    props: 'value',
    event: 'change'
  },
  props: {
    value: {
      type: [String, Array],
      default: null
    },
    name: {
      type: String,
      default: null
    },
    type: {
      type: String,
      default: null
    },
    values: {
      type: Array,
      required: true
    },
    id: {
      type: [String, Number],
      required: true
    }
  },
  data() {
    return {
      val: this.value
    }
  },
  methods: {
    onChangeSelect(val) {
      this.val = val
      this.$emit('change', {
        property_id: this.id,
        value: this.val,
        is_value_id: true
      })
    },
    onChangeMultipleSelect(val) {
      this.$emit('change', {
        property_id: this.id,
        value: val,
        is_value_id: true
      })
    },
    onInput(val) {
      this.val = val
      this.$emit('change', {
        property_id: this.id,
        value: this.val
      })
    },
    convertToArray(items) {
      try {
        return items.map((item) => ({
          name: item.value,
          value: item.code_1c
        }))
      } catch (e) {
        console.log(e)
      }
    },
    getValueData(ID, data) {
      return Array.isArray(data)
        ? data
            .filter((el) => el.property_id === ID)
            .map((el) => el.value)
            .join('')
        : this.val
    },
    getValueFromDataMultiple(ID, data) {
      if (data) {
        return data
          .filter((el) => el.property_id === ID)
          .map((el) => el.value)
          .flat()
      } else {
        return []
      }
    }
  }
}
</script>
