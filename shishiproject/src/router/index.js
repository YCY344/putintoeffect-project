import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/sql', name: 'SQL', component: () => import('../views/SqlGenerator.vue') },
  { path: '/port', name: 'Port', component: () => import('../views/PortChecker.vue') },
  { path: '/deployment', name: 'Deployments', component: () => import('../views/DeploymentBoard.vue') }
];

const router = createRouter({
  history: createWebHistory(),
  routes
}); 

export default router;