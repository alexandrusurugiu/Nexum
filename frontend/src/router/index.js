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
      path: '/componente',
      name: 'componente',
      component: () => import('../pages/ComponentsPage.vue')
    },
    {
      path: '/monitoare',
      name: 'monitoare',
      component: () => import('../pages/MonitorsPage.vue')
    },
    {
      path: '/laptopuri',
      name: 'laptopuri',
      component: () => import('../pages/LaptopsPage.vue')
    },
    {
      path: '/periferice',
      name: 'periferice',
      component: () => import('../pages/PeripheralsPage.vue')
    },
    {
      path: '/configurator',
      name: 'configurator',
      component: () => import('../pages/ConfigPage.vue')
    }
  ],
})

export default router