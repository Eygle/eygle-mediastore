import 'reflect-metadata'
import '@/assets/styles.scss'

import { Component, createApp } from 'vue'
import vuetify from './plugins/vuetify'
import App from './App.vue'
import router from './router'
import defaultLayout from './layouts/default.vue'
import { Layout } from '@/types/Layout'

const app = createApp(App)

app
  .component(Layout.Default, defaultLayout as unknown as Component)
  .use(router)
  .use(vuetify)
  .mount('#app')
