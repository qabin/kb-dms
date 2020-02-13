import left from '../layouts/left-menu'
import header from '../layouts/header-menu'
import footer from '../layouts/footer-menu'
import configHeader from '../pages/config/layouts/header-menu'

export default [
  {
    path: '',
    component: () => import('../layouts/index'),
    children: [
      {
        path: '/',
        components: {
          left, header, footer,
          page: () => import('../pages/home/index')
        },
        meta: {
          title: 'DMS-给你一个权限可控、记录可追踪的WEB版数据库管理平台！'
        }
      },
      {
        path: '/index',
        components: {
          left, header, footer,
          page: () => import('../pages/home/index')
        },
        meta: {
          title: 'DMS-给你一个权限可控、记录可追踪的WEB版数据库管理平台！'
        }
      },
      {
        path: '/history',
        components: {
          left, header, footer,
          page: () => import('../pages/history/index')
        },
        meta: {
          title: 'DMS-历史记录！'
        }
      },
      {
        path: '/statistics',
        components: {
          left, header, footer,
          page: () => import('../pages/statistics/index')
        },
        meta: {
          title: 'DMS-统计信息！'
        }
      },
    ]
  },
  {
    path: '/login',
    component: () => import('../pages/user/login'),
    meta: {
      title: 'DMS-登录页面！'
    }
  },
  {
    path: '/register',
    component: () => import('../pages/user/register'),
    meta: {
      title: 'DMS-注册页面！'
    }
  },
  {
    path: '',
    component: () => import('../pages/config/layouts/index'),
    children: [
      {
        path: '/config/system_config',
        components: {
          header: configHeader, footer,
          page: () => import('../pages/config/system_config')
        },
        meta: {
          title: 'DMS-配置管理！'
        }
      },
    ]
  },
]
