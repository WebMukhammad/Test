import { getFormData } from './helper'

export default {
  get() {
    return this.$axios.$get()
  },
  send({ data } = {}) {
    return this.$axios.$post()
  },
  sendDoc({ name, fileList } = {}) {
    return this.$axios.$post()
  }
}
