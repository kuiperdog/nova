import { createRouter, createWebHistory } from 'vue-router'
import ObjektView from '../views/ObjektView.vue'
import GravityView from '../views/GravityView.vue'
import UsersView from '../views/UsersView.vue'
import ProfileView from '../views/ProfileView.vue'
import BookmarksView from '../views/BookmarksView.vue'
import InfoView from '../views/InfoView.vue'
import ObjektModal from '../components/ObjektModal.vue'

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
            path: '/objekt/:collection/:serial?',
            name: 'objektmodal',
            props: true,
            components: {
                default: ObjektView,
                modal: ObjektModal
            },
            beforeEnter: (to, from, next) => {
                if (from.matched[0]) {
                    to.matched[0].components.default = from.matched[0].components.default
                    to.params.lastRoute = from.fullPath
                }
                next()
            }
        },
        {
            path: '/gravity/:artist?/:gravityId?/:index?',
            name: 'gravity',
            props: true,
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
        },
        {
            path: '/info',
            name: 'info',
            component: InfoView
        }
    ]
})

export default router
