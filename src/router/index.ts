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
    { path: '/profiles/:id', name: RouteName.Profile, component: () => import('../pages/MediaGroupDetailsPage.vue') },
    {
      path: '/stars',
      name: RouteName.Stars,
      component: () => import('../pages/MediaGroupsListPage.vue'),
      meta: { field: Field.Star, navbar: true, icon: 'mdi-card-account-details-star' },
    },
    { path: '/stars/:id', name: RouteName.Star, component: () => import('../pages/MediaGroupDetailsPage.vue') },
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
      meta: { navbar: true, icon: 'mdi-tag', divider: true },
    },
    { path: '/tags/:id', name: RouteName.Tag, component: () => import('../pages/Tag.vue') },
    {
      path: '/in-progress',
      name: RouteName.InProgress,
      component: () => import('../pages/MediaGroupsByFieldsPage.vue'),
      meta: { navbar: true, icon: 'mdi-timer-sand', divider: true },
    },
    {
      path: '/to-see',
      name: RouteName.ToSee,
      component: () => import('../pages/MediaGroupsByFieldsPage.vue'),
      meta: { navbar: true, icon: 'mdi-eye' },
    },
    {
      path: '/best',
      name: RouteName.Best,
      component: () => import('../pages/MediaGroupsByFieldsPage.vue'),
      meta: { navbar: true, icon: 'mdi-star' },
    },
    {
      path: '/to-tag',
      name: RouteName.ToTag,
      component: () => import('../pages/MediaGroupsByFieldsPage.vue'),
      meta: { navbar: true, icon: 'mdi-tag-plus', groups: true },
    },
    {
      path: '/commented',
      name: RouteName.Commented,
      component: () => import('../pages/MediaGroupsByFieldsPage.vue'),
      meta: { navbar: true, icon: 'mdi-comment', groups: true },
    },
    {
      path: '/to-follow',
      name: RouteName.ToFollow,
      component: () => import('../pages/MediaGroupsListPage.vue'),
      meta: { navbar: true, icon: 'mdi-youtube-subscription', field: RouteName.ToFollow },
    },
  ],
})

export default router
