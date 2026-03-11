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
    },
    {
      path: '/cart',
      name: 'cart',
      component: () => import('../pages/CartPage.vue')
    },
    {
      path: '/profil',
      name: 'profil',
      component: () => import('../pages/ProfilePage.vue')
    },
    {
      path: '/despre',
      name: 'About',
      component: () => import('../pages/AboutPage.vue')
    },
    {
      path: '/setari',
      name: 'setari',
      component: () => import('../pages/SettingsPage.vue')
    },
    {
      path: '/search',
      name: 'Search',
      component: () => import('../pages/SearchPage.vue')
    },
    {
      path: '/checkout',
      name: 'Checkout',
      component: () => import('../pages/CheckoutPage.vue')
    },
    {
      path: '/produs/:id',
      name: 'Product',
      component: () => import('../pages/ProductPage.vue')
    },
    {
      path: '/build/:code',
      name: 'ShareBuild',
      component: () => import('../pages/ShareBuildPage.vue')
    },
    { 
      path: '/admin', 
      name: 'Admin', 
      component: () => import('../pages/AdminPanelPage.vue'),
      beforeEnter: (to, from, next) => {
        const user = JSON.parse(localStorage.getItem('nexum_user'));
            
        if (user && user.isAdmin === true) {
          next();
        } else {
          next('/home');
          }
      }
    } 
  ],
})

export default router