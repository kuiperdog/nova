import { createRouter, createWebHistory } from 'vue-router'
import ObjektView from '../views/ObjektView.vue'
import GravityView from '../views/GravityView.vue'
import UsersView from '../views/UsersView.vue'
import ProfileView from '../views/ProfileView.vue'
import BookmarksView from '../views/BookmarksView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/objekt'
    },
    {
      path: '/objekt',
      name: 'objekt',
      component: ObjektView
    },
    {
      path: '/gravity',
      name: 'gravity',
      component: GravityView
    },
    {
      path: '/users',
      name: 'users',
      component: UsersView
    },
    {
      path: '/@:id',
      name: 'profile',
      component: ProfileView
    },
    {
      path: '/bookmarks',
      name: 'bookmarks',
      component: BookmarksView
    }
  ]
})

export default router
