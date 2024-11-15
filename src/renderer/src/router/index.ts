import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'camera',
      component: () => import('../views/camera/index.vue')
    }
  ]
})

export default router
