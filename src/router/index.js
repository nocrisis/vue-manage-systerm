import Vue from 'vue'
import Router from 'vue-router'
import Index from '../views/Index'
import Register from '../views/Register'
import Nofind from '../views/404'
import Login from '../views/Login'
import Home from '../views/Home'
import Infoshow from '../views/Infoshow'
import UserDept from '../views/UserDept'
import Role from '../views/Role'

Vue.use(Router);

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    { path: '*', name: '/404', component: Nofind },
    { path: '/', redirect: '/index' },
    {
      path: '/index', name: 'index', component: Index,
      children: [
        { path: '', component: Home },
        { path: '/home', name: 'home', component: Home },
        { path: '/infoshow', name: 'infoshow', component: Infoshow },
        { path: '/userdept', name: 'userdept', component: UserDept },
        { path: '/role', name: 'role', component: Role },
      ]
    },
    { path: '/register', name: 'register', component: Register },
    { path: '/login', name: 'login', component: Login }
    //   component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
  ]
});

//路由守卫
router.beforeEach((to, from, next) => {
  const isLogin = localStorage.eleToken ? true : false;
  if (to.path == '/login' || to.path == '/register') {
    next();
  } else {
    isLogin ? next() : next("/login");
  }
});

export default router;