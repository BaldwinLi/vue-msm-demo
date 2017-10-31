// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import App from './App'
import router from '@/common/router'
import '@/app'
import store from '@/common/vuex/store';

/* eslint-disable no-new */
new window.Vue({
  el: '#app',
  render: h => h(App),
  router,
  store
})
