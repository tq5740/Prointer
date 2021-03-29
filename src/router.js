/* eslint-disable no-undef */
// import Vue from 'vue';
// import VueRouter from 'vue-router';
import Home from './views/Home.vue';

// Vue.use(VueRouter);

const routes = [
	{
		path: '/',
		redirect: '/index',
	},
	{
		path: '/index',
		component: Home,
	},
	{
		path: '/user',
		component: () => import('./views/User.vue'),
	},
	{
		path: '/company',
		component: () => import('./views/Company.vue'),
	},
];
const router = new VueRouter({
	mode: 'history',
	routes,
});
router.beforeEach((to, from, next) => {
	next()
});
export default router;
