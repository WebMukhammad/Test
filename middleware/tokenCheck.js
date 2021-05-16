export default function ({ store, $axios, redirect }) {
  if (store.state.token.token) {
    $axios.setToken(store.state.token.token)
  } else {
    redirect(302, '/sign-in')
  }
}
