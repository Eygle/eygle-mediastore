import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home.vue'
import { RouteName } from '@/types/RouteName'
import { Field } from '@/types/Field'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: RouteName.Home, component: Home },
    {
      path: '/categories',
      name: RouteName.Categories,
      component: () => import('../pages/MediaGroupsListPage.vue'),
      meta: { field: Field.Category, navbar: true, icon: 'mdi-dots-grid' },
    },
    {
      path: '/categories/:id',
      name: RouteName.Category,
      component: () => import('../pages/MediaGroupDetailsPage.vue'),
    },
    {
      path: '/movies',
      name: RouteName.Movies,
      component: () => import('../pages/MediaGroupsListPage.vue'),
      meta: { field: Field.Movie, navbar: true, icon: 'mdi-movie-open' },
    },
    {
      path: '/movies/:id',
      name: RouteName.Movie,
      component: () => import('../pages/MediaGroupDetailsPage.vue'),
    },
    {
      path: '/profiles',
      name: RouteName.Profiles,
      component: () => import('../pages/MediaGroupsListPage.vue'),
      meta: { field: Field.Profile, navbar: true, icon: 'mdi-account-group' },
    },
    {
      path: '/profiles/:id',
      name: RouteName.Profile,
      component: () => import('../pages/MediaGroupDetailsPage.vue'),
      meta: { taggableParent: true },
    },
    {
      path: '/stars',
      name: RouteName.Stars,
      component: () => import('../pages/MediaGroupsListPage.vue'),
      meta: { field: Field.Star, navbar: true, icon: 'mdi-card-account-details-star' },
    },
    {
      path: '/stars/:id',
      name: RouteName.Star,
      component: () => import('../pages/MediaGroupDetailsPage.vue'),
      meta: { taggableParent: true },
    },
    {
      path: '/websites',
      name: RouteName.Websites,
      component: () => import('../pages/MediaGroupsListPage.vue'),
      meta: { field: Field.Website, navbar: true, icon: 'mdi-web' },
    },
    { path: '/websites/:id', name: RouteName.Website, component: () => import('../pages/MediaGroupDetailsPage.vue') },
    {
      path: '/tags',
      name: RouteName.Tags,
      component: () => import('../pages/Tags.vue'),
      meta: { navbar: true, icon: 'mdi-label', divider: true },
    },
    { path: '/tags/:id', name: RouteName.Tag, component: () => import('../pages/Tag.vue') },
    {
      path: '/in-progress',
      name: RouteName.InProgress,
      component: () => import('../pages/MediaListPage.vue'),
      meta: { navbar: true, icon: 'mdi-timer-sand', divider: true },
    },
    {
      path: '/to-see',
      name: RouteName.ToSee,
      component: () => import('../pages/MediaListPage.vue'),
      meta: { navbar: true, icon: 'mdi-eye' },
    },
  ],
})

export default router
