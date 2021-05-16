import { getFormData } from './helper'

export default {
  login({ email, password }) {
    return this.$axios.$post()
  },
  getUserData() {
    return this.$axios.$get()
  },
  changePassword({ oldPassword, password, passwordConfirmation }) {
    return this.$axios.$patch()
  },
  sendPasswordResetEmail({ email }) {
    return this.$axios.$post()
  },
  resetPassword({ token, password, passwordConfirmation }) {
    return this.$axios.$post()
  },
  register({ name, email, password, phone }) {
    return this.$axios.$post()
  },
  confirm({ token }) {
    return this.$axios.$get()
  }
}
