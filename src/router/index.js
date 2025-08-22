import { createRouter, createWebHistory } from 'vue-router'
import WalletPage from '@/views/WalletPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/main',
      name: 'home',
      component: () => import('../views/MainPage.vue'),
    },
    {
      path: '/rating',
      name: 'rating',
      component: () => import('../views/RatingPage.vue')
    },
    {
      path: '/invite',
      name: 'invite',
      component: () => import('../views/InvitePage.vue')
    },
    {
      path: '/devices',
      name: 'devices',
      component: () => import('../views/DevicesPage.vue')
    },
    {
      path: '/',
      name: 'loader',
      component: () => import('../views/LoadPage.vue')
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('../views/SettingsPage.vue')
    },
    {
      path: '/wallet',
      name: 'wallet',
      component: WalletPage
    }
  ]
})

export default router
