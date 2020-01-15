const devRoutes = {
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
    {
      path: '/development/test',
      name: 'Test',
      mini: 'C',
      component: './Development/Control',
    },
    {
      path: '/development/imageeditor2',
      name: 'LCImageEditor',
      mini: 'CA',
      component: './Development/LCImageEditor',
    },
    {
      path: '/development/scribble',
      name: 'Scribble',
      mini: 'CA',
      component: './Development/Scribble',
    },
    {
      path: '/development/reportviewer',
      name: 'Report Sample',
      mini: 'RS',
      component: './Development/Report',
    },
    // {
    //   path: '/development/dentalchart',
    //   name: 'Dental Chart',
    //   mini: 'DC',
    //   component: './Development/DentalChart',
    // },
    {
      path: '/development/cannedtext',
      name: 'Canned Text',
      mini: 'CT',
      component: './Development/CannedText',
    },
  ],
}

export default devRoutes
