import path from 'path'
import dotenv from 'dotenv'
dotenv.config()

export default {
  /*
   ** Nuxt rendering mode
   ** See https://nuxtjs.org/api/configuration-mode
   */
  mode: 'universal',
  /*
   ** Nuxt target
   ** See https://nuxtjs.org/api/configuration-target
   */
  target: 'server',
  /*
   ** Headers of the page
   ** See https://nuxtjs.org/api/configuration-head
   */
  head: {
    title: 'Тест',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: '...'
      }
    ],
    link: [
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        href: '/favicon-32x32.png'
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        href: '/favicon-16x16.png'
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Ubuntu:ital,wght@0,400;0,500;1,400;1,500&display=swap'
      }
    ]
  },
  eslint: {
    cache: false
  },
  /*
   ** Global CSS
   */
  css: ['~/assets/css/index.css'],
  /*
   ** Plugins to load before mounting the App
   ** https://nuxtjs.org/guide/plugins
   */
  plugins: [
    '~/plugins/validation.js',
    '~/plugins/mask.js',
    '~/plugins/InfiniteLoading.js',
    { src: '~/plugins/globalErrorHandler.js', mode: 'client' },
    { src: '~/plugins/vueShortkey.js', mode: 'client' },
    '~/plugins/persistedState.js'
  ],
  axios: {
    baseURL: process.env.BASE_URL
  },
  /*
   ** Auto import components
   ** See https://nuxtjs.org/api/configuration-components
   */
  components: [
    {
      path: '~/components',
      extensions: ['vue'],
      pathPrefix: false
    }
  ],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    // '@nuxtjs/eslint-module'
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/sentry',
    ['cookie-universal-nuxt'],
    function () {
      if (process.env.YANDEX_METRIKA_ID) return '@nuxtjs/yandex-metrika'
    }
  ],
  yandexMetrika: {
    id: process.env.YANDEX_METRIKA_ID,
    webvisor: true,
    clickmap: true,
    trackLinks: true,
    accurateTrackBounce: true
  },

  /*
   ** Build configuration
   ** See https://nuxtjs.org/api/configuration-build/
   */
  build: {
    transpile: ['vee-validate/dist/rules'],
    postcss: {
      // Add plugin names as key and arguments as value
      // Install them before as dependencies with npm or yarn
      plugins: {
        'postcss-import': {},
        'postcss-each': {},
        'postcss-extend': {},
        'postcss-nested-ancestors': {},
        'postcss-nested': {},
        'postcss-css-variables': {},
        'postcss-preset-env': {},
        'postcss-move-props-to-bg-image-query': {},
        'postcss-inline-svg': {
          paths: [path.join(__dirname, './assets/img')],
          removeFill: true
        },
        'postcss-custom-media': {},
        cssnano: {
          preset: 'default'
        }
      }
    }
  }
}
