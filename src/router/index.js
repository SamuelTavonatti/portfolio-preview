import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ProjectsView from '../views/ProjectsView.vue'
import CaseStudyView from '../views/CaseStudyView.vue'
import ExperienceView from '../views/ExperienceView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/progetti',
    name: 'projects',
    component: ProjectsView,
  },
  {
    path: '/progetti/:slug',
    name: 'case-study',
    component: CaseStudyView,
  },
  {
    path: '/esperienze',
    name: 'experience',
    component: ExperienceView,
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    if (to.hash) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            el: to.hash,
            behavior: 'smooth',
            top: 84,
          })
        }, 240)
      })
    }
    return { top: 0, behavior: 'smooth' }
  },
})

export default router
