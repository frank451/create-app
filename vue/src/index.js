// Import Vue
import Vue from 'vue';
import VueRouter from 'vue-router';

// Import Vue App, routes, store
import App from './App';
import routes from './routes';

import AppHome from 'mod/AppHome';

// new Vue({
// 	el: '#app',
// 	components: { AppHome },
// 	template: '<App/>'
// });

// Vue.use(VueRouter);

// // Configure router
// const router = new VueRouter({
// 	routes,
// 	linkActiveClass: 'active',
// 	mode: 'history'
// });

// new Vue({
// 	el: '#app',
// 	render: h => h(App),
// 	router
// });
// const app = new Vue({
// 	router
// }).$mount('#app');

const app = new Vue({
  el: '#app',
  components: {
    'AppHome'} 
});
