import Loadable from 'react-loadable'
import Loading from '@/components/PageLoading/index'

export const gpWidgets = (props) => [
  {
    id: '1',
    name: 'Clinical Notes',
    component: Loadable({
      loader: () => import('./ClinicalNotes'),
      render: (loaded, p) => {
        let Cmpnet = loaded.default
        return <Cmpnet {...props} {...p} />
      },
      loading: Loading,
    }),
  },
  {
    id: '2',
    name: 'Chief Complaints',
    component: Loadable({
      loader: () => import('./ChiefComplaints'),
      render: (loaded, p) => {
        let Cmpnet = loaded.default
        return <Cmpnet {...props} {...p} />
      },
      loading: Loading,
    }),
  },
  {
    id: '3',
    name: 'Plan',
    component: Loadable({
      loader: () => import('./Plan'),
      render: (loaded, p) => {
        let Cmpnet = loaded.default
        return <Cmpnet {...props} {...p} />
      },
      loading: Loading,
    }),
  },
  {
    id: '4',
    name: 'Diagnosis',
    component: Loadable({
      loader: () => import('./Diagnosis'),
      render: (loaded, p) => {
        let Cmpnet = loaded.default
        return <Cmpnet {...props} {...p} />
      },
      loading: Loading,
    }),
  },
  {
    id: '5',
    name: 'Orders',
    component: Loadable({
      loader: () => import('./Orders'),
      render: (loaded, p) => {
        let Cmpnet = loaded.default
        return <Cmpnet {...props} {...p} />
      },
      loading: Loading,
    }),
  },
  {
    id: '6',
    name: 'Consultation Document',
    component: Loadable({
      loader: () => import('./ConsultationDocument'),
      render: (loaded, p) => {
        let Cmpnet = loaded.default
        return <Cmpnet {...props} {...p} />
      },
      loading: Loading,
    }),
  },
  // {
  //   id: '6',
  //   name: 'Result History',
  //   component: Loadable({
  //     loader: () => import('./ResultHistory'),
  //     render: (loaded, p) => {
  //       let Cmpnet = loaded.default
  //       return <Cmpnet {...props} {...p} />
  //     },
  //     loading: Loading,
  //   }),
  // },
  {
    id: '7',
    name: 'Invoice',
    component: Loadable({
      loader: () => import('./Invoice'),
      render: (loaded, p) => {
        let Cmpnet = loaded.default
        return <Cmpnet {...props} {...p} />
      },
      loading: Loading,
    }),
  },
]

export const dentalWidgets = (props) => [
  {
    id: '1',
    name: 'Clinical Notes',
    component: Loadable({
      loader: () => import('./Notes'),
      render: (loaded, p) => {
        let Cmpnet = loaded.default
        return <Cmpnet {...props} {...p} fieldName='clinicalNote' />
      },
      loading: Loading,
    }),
  },
  {
    id: '2',
    name: 'Chief Complaints',
    component: Loadable({
      loader: () => import('./Notes'),
      render: (loaded, p) => {
        let Cmpnet = loaded.default
        return <Cmpnet {...props} {...p} fieldName='chiefComplaints' />
      },
      loading: Loading,
    }),
  },
  {
    id: '3',
    name: 'Associated History',
    component: Loadable({
      loader: () => import('./Notes'),
      render: (loaded, p) => {
        let Cmpnet = loaded.default
        return <Cmpnet {...props} {...p} fieldName='associatedHistory' />
      },
      loading: Loading,
    }),
  },
  {
    id: '4',
    name: 'Intra Oral',
    component: Loadable({
      loader: () => import('./Notes'),
      render: (loaded, p) => {
        let Cmpnet = loaded.default
        return <Cmpnet {...props} {...p} fieldName='intraOral' />
      },
      loading: Loading,
    }),
  },
  {
    id: '5',
    name: 'Extra Oral',
    component: Loadable({
      loader: () => import('./Notes'),
      render: (loaded, p) => {
        let Cmpnet = loaded.default
        return <Cmpnet {...props} {...p} fieldName='extraOral' />
      },
      loading: Loading,
    }),
  },
  {
    id: '6',
    name: 'Attachment',
    component: Loadable({
      loader: () => import('./Attachment'),
      render: (loaded, p) => {
        let Cmpnet = loaded.default
        return <Cmpnet {...props} {...p} />
      },
      loading: Loading,
    }),
  },
  {
    id: '7',
    name: 'Orders',
    component: Loadable({
      loader: () => import('./Orders'),
      render: (loaded, p) => {
        let Cmpnet = loaded.default
        return <Cmpnet {...props} {...p} />
      },
      loading: Loading,
    }),
  },
  {
    id: '8',
    name: 'Invoice',
    component: Loadable({
      loader: () => import('./Invoice'),
      render: (loaded, p) => {
        let Cmpnet = loaded.default
        return <Cmpnet {...props} {...p} />
      },
      loading: Loading,
    }),
  },
]
