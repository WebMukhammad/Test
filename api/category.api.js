import { serializeQueryParams } from './helper'

export default {
  get({ include } = {}) {
    return this.$axios.$get()
  },
  getByID({ id, include = 'children' } = {}) {
    return this.$axios.$get()
  },
  search({ query, name } = {}) {
    return this.$axios.$get()
  }
}
