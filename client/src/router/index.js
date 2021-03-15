import { createRouter, createWebHashHistory } from 'vue-router'
import Page from '@/views/page'
import EmptyLayout from '@/components/EmptyLayout'
import Empty from '@/views/page/modules/empty'
import Overview from '@/views/page/modules/overview'
import Record from '@/views/page/modules/record'

const routes = [
  {
    path: '/',
    redirect: '/page'
  },
  {
    path: '/page',
    name: 'Page',
    component: Page,
    children: [
      { path: '', redirect: '/page/empty' },
      { path: '/page/empty', component: Empty },
      {
        path: '/page/:id',
        component: EmptyLayout,
        children: [
          {
            path: '/page/:id/overview',
            name: 'Overview',
            component: Overview
          },
          {
            path: '/page/:id/record',
            component: EmptyLayout,
            children: [
              { path: '/page/:id/record/:index', name: 'Record', component: Record }
            ]
          }
        ]
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
