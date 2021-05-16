import { serializeQueryParams } from './helper'

export default {
  get({ page = 1, perPage = 50 } = {}) {
    return this.$axios.$get()
  },
  search({ page = 1, perPage = 50, state }) {
    return this.$axios.$get( )
  },
  getByID(id) {
    return this.$axios.$get()
  }
}
