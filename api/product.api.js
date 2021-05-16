export default {
  get({ page = 1, perPage = 50, sort, order } = {}) {
    return this.$axios.$get()
  },
  getByID(id) {
    return this.$axios.$get()
  },
  create(data) {
    return this.$axios.$post()
  },
  update(id, data) {
    return this.$axios.$put()
  },
  search({ page = 1, perPage = 50, query, state, sort, order, categories }) {
    return this.$axios.$get()
  },
  getStatusList() {
    return this.$axios.$get()
  },
  sendImage({ images } = {}) {
    return this.$axios.$post()
  },
  deleteImage(id) {
    return this.$axios.$delete()
  },
  patch(id, data) {
    return this.$axios.$patch()
  },
  archive(data) {
    return this.$axios.$post()
  },
  unarchive(data) {
    return this.$axios.$post()
  },
  getTemplateXLS({ categoriesIds } = {}) {
  },
  sendTemplate({ file } = {}) {
    return this.$axios.$post()
  }  
  
}
