import 'babel-polyfill'
import axios from 'axios'

import Vue from 'vue'
import App from './App.vue'

import router from './router'

/* eslint-disable no-new */
new Vue({
  router,

  el: '#app',
  render: (h) => h(App)
})