import { serializeQueryParams } from './helper'

export default {
  get({ page = 1, perPage = 50 } = {}) {
    return this.$axios.$get()
  },
  getCount() {
    return this.$axios.$get()
  },
  mark({ arr } = {}) {
    return this.$axios.$post()
  },
  remove() {
    return this.$axios.$post()
  }
}
