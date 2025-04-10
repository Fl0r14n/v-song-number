import { createApp } from 'vue'
import { createRouter, createWebHistory } from '@ionic/vue-router'
import App from './App.vue'

import { IonicVue } from '@ionic/vue'

import './theme/global.scss'
import LayoutPage from '@/layout/pages/LayoutPage.vue'
import { createI18n } from 'vue-i18n'
import { en } from '@/i18n/en'
import { ro } from '@/i18n/ro'

import { defineCustomElements } from '@ionic/pwa-elements/loader'
import { createPinia } from 'pinia'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: LayoutPage,
      children: [
        {
          path: '',
          redirect: '/main'
        },
        {
          path: 'main',
          name: 'main',
          component: () => import('@/main/pages/MainPage.vue')
        },
        {
          path: 'info',
          name: 'info',
          component: () => import('@/info/pages/InfoPage.vue')
        },
        {
          path: 'books',
          name: 'books',
          component: () => import('@/books/pages/BooksPage.vue')
        },
        {
          path: 'config',
          name: 'config',
          component: () => import('@/config/pages/ConfigPage.vue')
        },
        {
          path: '/:catchAll(.*)',
          redirect: '/main'
        }
      ]
    }
  ]
})
const i18n = createI18n({
  legacy: false,
  fallbackLocale: 'en',
  messages: {
    en,
    ro
  },
  fallbackWarn: false,
  missingWarn: false
})
const pinia = createPinia()

const app = createApp(App)
  .use(pinia)
  .use(IonicVue, {
    experimentalCloseWatcher: true,
    innerHTMLTemplatesEnabled: true
  })
  .use(router)
  .use(i18n)
router.isReady().then(async () => {
  await defineCustomElements(globalThis.window)
  app.mount('#app')
})
