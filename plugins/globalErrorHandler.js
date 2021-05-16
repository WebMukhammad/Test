import Vue from 'vue'

Vue.config.errorHandler = function (event) {
  console.log('Global vue error handler', event)
}

window.onunhandledrejection = function (event) {
  console.log('Catch unhandled event', event)
}
