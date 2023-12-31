import { createRouter, createWebHistory } from 'vue-router'
import ObjektView from '../views/ObjektView.vue'
import GravityView from '../views/GravityView.vue'
import BookmarksView from '../views/BookmarksView.vue'
import UserView from '../views/UserView.vue'
import InfoView from '../views/InfoView.vue'
import CollectionView from '../views/profile/CollectionView.vue'
import TradesView from '../views/profile/TradesView.vue'
import VotesView from '../views/profile/VotesView.vue'
import ComoView from '../views/profile/ComoView.vue'
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
                    if (from.matched[1])
                        to.matched[1] = from.matched[1]
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
            path: '/bookmarks',
            name: 'bookmarks',
            component: BookmarksView
        },
        {
            path: '/@:user?',
            name: 'user',
            props: true,
            component: UserView,
            children: [
                {
                    path: 'collection',
                    component: CollectionView,
                    alias: ''
                },
                {
                    path: 'trades',
                    component: TradesView
                },
                {
                    path: 'votes',
                    component: VotesView
                },
                {
                    path: 'como',
                    component: ComoView
                }
            ]
        },
        {
            path: '/info',
            name: 'info',
            component: InfoView
        }
    ]
})

export default router
