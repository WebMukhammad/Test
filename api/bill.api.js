import { serializeQueryParams } from './helper'

export default {
  get({ page = 1, perPage = 50 } = {}) {
    return this.$axios.$get()
  }
}
