import Vue from 'vue'
import VueRouter from 'vue-router'

import Main from './Main.vue'

Vue.use(VueRouter)

const router = new VueRouter({
    routes: [
        { path: '/', component: Main }
    ]
})

export default router