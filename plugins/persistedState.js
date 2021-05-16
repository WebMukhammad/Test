import createPersistedState from 'vuex-persistedstate'

export default ({ store, req, app }) => {
  createPersistedState({
    key: 'test...',
    paths: ['token'],
    storage: {
      getItem(key) {
        // See https://nuxtjs.org/guide/plugins/#using-process-flags
        const el = app.$cookies.get(key, {
          parseJSON: false
        })
        return el
      },
      // Please see https://github.com/js-cookie/js-cookie#json, on how to handle JSON.
      setItem(key, value) {
        app.$cookies.set(key, value, {
          maxAge: 60 * 60 * 24 * 7,
          secure: process.env.production,
          path: '/'
        })
      },
      removeItem: (key) =>
        app.$cookies.remove(key, {
          path: '/'
        })
    }
  })(store)
}
