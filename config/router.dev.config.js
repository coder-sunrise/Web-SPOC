const devRoutes = {
  path: '/development',
  name: 'Development',
  icon: 'icon-wrench',
  routes: [
    {
      path: '/development/control',
      name: 'Control',
      mini: 'C',
      component: './Development/Control',
    },
    {
      path: '/development/test',
      name: 'Table',
      mini: 'T',
      component: './Development/Table',
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
    {
      path: '/development/cannedtext',
      name: 'Canned Text',
      mini: 'CT',
      component: './Development/CannedText',
    },
    {
      path: '/development/masonry',
      name: 'Masonry',
      mini: 'M',
      component: './Development/Masonry',
    },
  ],
}

export default devRoutes
