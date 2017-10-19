import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/login'
import Home from '@/msm/designer/home'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/',
      name: 'home',
      component: Home
    }
  ]
})
