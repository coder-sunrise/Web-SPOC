const routes = [
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', component: './User/Login' },
      { path: '/user/register', component: './User/Register' },
      { path: '/user/register-result', component: './User/RegisterResult' },
    ],
  },
  //
  // login
  {
    path: '/login',
    component: './Login',
    hideInMenu: true,
  },
  // login
  //
  // CMS
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: [
      'src/pages/Authorized',
    ],
    authority: [
      'admin',
      'user',
      'guest',
    ],
    routes: [
      // dashboard

      // Settings
      {
        hideInMenu: process.env.NODE_ENV === 'production',
        path: '/development',
        name: 'Development',
        routes: [
          {
            path: '/development/control',
            name: 'Control',
            mini: 'C',
            component: './Development/Control',
          },
        ],
      },
      {
        component: '404',
      },
    ],
  },
]
export default routes
