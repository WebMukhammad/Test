export const state = () => ({
  data: {}
})

export const mutations = {
  setData(state, data) {
    state.data = data
  },
  setStatus(state, data) {
    if (state.data?.store) {
      state.data.store.status = data
    }
  },
  setNotificationCount(state, notificationCount) {
    state.data.unreadNotificationsCount = notificationCount
  },
  logout() {
    this.$router.push('/sign-in')
    this.commit('token/setToken', null)
    this.commit('user/setData', null)
  }
}

export const getters = {
  isSeller: (state) => state.data?.store?.status?.name === 'activated',
  isUser: (state) => state.data?.store?.status.name !== 'activated',
  name: (state) => {
    if (state.data?.name) {
      return state.data.name
    } else if (state.data?.email) {
      return state.data.email
    } else {
      return 'Пользователь'
    }
  },
  balance: (state) =>
    Math.round(state.data?.store?.balance)
      .toString()
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ')
}
