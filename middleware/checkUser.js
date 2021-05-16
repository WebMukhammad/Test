export default function ({ store, redirect }) {
  if (store.state.token.token) {
    redirect(302, '/product')
  }
}
