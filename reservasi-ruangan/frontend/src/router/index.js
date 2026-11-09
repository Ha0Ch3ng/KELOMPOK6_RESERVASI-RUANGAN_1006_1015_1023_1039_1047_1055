import { createRouter, createWebHistory } from 'vue-router'
import ReservasiListView from '../views/ReservasiListView.vue'
import ReservasiCreateView from '../views/ReservasiCreateView.vue'
import ReservasiEditView from '../views/ReservasiEditView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'reservasi-list', component: ReservasiListView },
    { path: '/tambah', name: 'reservasi-create', component: ReservasiCreateView },
    { path: '/edit/:id', name: 'reservasi-edit', component: ReservasiEditView },
  ],
})

export default router
