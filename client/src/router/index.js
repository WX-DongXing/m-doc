import { createRouter, createWebHashHistory } from 'vue-router'
import Flow from '../views/flow'
import History from '../views/history'

const routes = [
  {
    path: '/',
    name: 'Flow',
    component: Flow
  },
  {
    path: '/history',
    name: 'History',
    component: History
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
