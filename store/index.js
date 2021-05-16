export const mutations = {
  openChat() {
    window.Chatra && window.Chatra('openChat', true)
  }
}
