import AppHome from 'mod/AppHome';
const AppMedium = () => import('mod/AppMedium');

const routes = [
	{
		path: '/',
		name: 'Home',
		component: AppHome
		// component: require('./components/mod/AppHome.vue').default
	}
	// {
	// 	path: '/medium',
	// 	name: 'Medium',
	// 	component: AppMedium
	// }
];

export default routes;
