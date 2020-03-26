import Vue from 'vue'
import Router from 'vue-router'
import routes from './routes'
import extend from 'quasar-framework/src/utils/extend'
import localStorageUtil from '../utils/local_storage_utils'

Vue.use(Router)


const router = new Router({
  mode: 'hash',
  base: '/',
  routes
})

const login = (to, from, next) => {
  if (!localStorageUtil.get("isLogin") && (to.path !== '/login' && to.path !== '/register')) {
    cache_route.path = cache_route.path || to.path;
    cache_route.query = cache_route.query || to.query;
    cache_route.params = cache_route.params || to.params;
    next('/login');
  }
};

router.beforeEach((to, from, next) => {
  to.meta.title && (document.title = to.meta.title);
  if (!localStorageUtil.get("isLogin")) {
    login(to, from, next);

  } else if (cache_route.path && from.path === '/login') {

    let cache_route_ = extend(true, {}, cache_route);
    cache_route.path = cache_route.query = cache_route.params = null;
    cache_route_.path !== '/login' && to.path !== '/register' ? next(cache_route_) : next();
  }
  next()
});

export default router;
export const cache_route = {};
