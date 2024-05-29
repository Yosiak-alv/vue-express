import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      
    },
    {
      path: '/book/:id',
      name: 'book',
      props: true,
      component: () => import('../views/BookView.vue')
    },
    {
      path: '/create',
      name: 'create',
      component: () => import('../views/BookCreateView.vue')
    },
    {
      path: '/edit/:id',
      name: 'edit',
      props: true,
      component: () => import('../views/BookEditView.vue')
    }
  ]
})

export default router
