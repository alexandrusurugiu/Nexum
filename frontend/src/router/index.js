import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
     {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/home',
      name: 'home',
      component: () => import('../pages/HomePage.vue')
    },
    {
      path: '/components',
      name: 'components',
      component: () => import('../pages/ComponentsPage.vue')
    },
    {
      path: '/monitors',
      name: 'monitors',
      component: () => import('../pages/MonitorsPage.vue')
    }
  ],
})

export default router