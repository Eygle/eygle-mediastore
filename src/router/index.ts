import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: Home },
    { path: '/profiles', name: 'profiles', component: () => import('../pages/Profiles.vue') },
    { path: '/categories', name: 'categories', component: () => import('../pages/Categories.vue') },
  ],
})

export default router
