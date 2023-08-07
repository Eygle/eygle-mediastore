import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home.vue'
import { RouteName } from '@/types/RouteName'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: RouteName.Home, component: Home },
    {
      path: '/categories',
      name: RouteName.Categories,
      component: () => import('../pages/Categories.vue'),
      meta: { navbar: true, icon: 'mdi-dots-grid' },
    },
    { path: '/categories/:id', name: RouteName.Category, component: () => import('../pages/Category.vue') },
    {
      path: '/profiles',
      name: RouteName.Profiles,
      component: () => import('../pages/Profiles.vue'),
      meta: { navbar: true, icon: 'mdi-account-group' },
    },
    { path: '/profiles/:id', name: RouteName.Profile, component: () => import('../pages/Profile.vue') },
    {
      path: '/stars',
      name: RouteName.Stars,
      component: () => import('../pages/Stars.vue'),
      meta: { navbar: true, icon: 'mdi-card-account-details-star' },
    },
    {
      path: '/websites',
      name: RouteName.Websites,
      component: () => import('../pages/Websites.vue'),
      meta: { navbar: true, icon: 'mdi-web' },
    },
    { path: '/websites/:id', name: RouteName.Website, component: () => import('../pages/Website.vue') },
    {
      path: '/tags',
      name: RouteName.Tags,
      component: () => import('../pages/Tags.vue'),
      meta: { navbar: true, icon: 'mdi-label', divider: true },
    },
    { path: '/tags/:id', name: RouteName.Tag, component: () => import('../pages/Tag.vue') },
  ],
})

export default router
