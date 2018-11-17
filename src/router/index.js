import Vue from 'vue'
import Router from 'vue-router'
import VueTouch from 'vue-touch'
import vueTap from 'v-tap'

Vue.use(Router)
Vue.use(vueTap)

Vue.use(VueTouch, {name: 'v-touch'})

export default new Router({
  routes: [
    {
      path: '/',
      name: 'defaultPage',
      component: resolve => require(['@/components/Find/defaultPage'], resolve)
    },
    {
      path: '/videoMusic',
      name: 'videoMusic',
      component: resolve => require(['@/components/Video/video'], resolve)
    },
    {
      path: '/me',
      name: 'me',
      component: resolve => require(['@/components/Me/me'], resolve)
    },
    {
      path: '/friend',
      name: 'friend',
      component: resolve => require(['@/components/Friend/friend'], resolve)
    },
    {
      path: '/search',
      name: 'search',
      component: resolve => require(['@/components/Find/search'], resolve)
    }
  ]
})
