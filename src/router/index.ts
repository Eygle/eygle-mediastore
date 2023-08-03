import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home.vue'
import { RouteName } from '@/types/RouteName'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: RouteName.Home, component: Home },
    { path: '/profiles', name: RouteName.Profiles, component: () => import('../pages/Profiles.vue') },
    { path: '/categories', name: RouteName.Categories, component: () => import('../pages/Categories.vue') },
    { path: '/categories/:id', name: RouteName.Category, component: () => import('../pages/Category.vue') },
  ],
})

export default router
