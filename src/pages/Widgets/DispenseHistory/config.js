import Loadable from 'react-loadable'
import Loading from '@/components/PageLoading/index'

export const WIDGETS_ID = {
  CONSUMABLE: '2',
  SERVICE: '4',
  TREATMENT: '5',
}

export const widgets = props => [
  {
    id: WIDGETS_ID.CONSUMABLE,
    name: 'Product',
    authority: undefined,
    component: Loadable({
      loader: () => import('./Consumable'),
      render: (loaded, p) => {
        let Cmpnet = loaded.default
        return <Cmpnet {...props} {...p} fieldName='consumable' />
      },
      loading: Loading,
    }),
  },
  {
    id: WIDGETS_ID.SERVICE,
    name: 'Service',
    authority: undefined,
    component: Loadable({
      loader: () => import('./Service'),
      render: (loaded, p) => {
        let Cmpnet = loaded.default
        return <Cmpnet {...props} {...p} fieldName='service' />
      },
      loading: Loading,
    }),
  },
  {
    id: WIDGETS_ID.TREATMENT,
    name: 'Treatment',
    authority:
      'patientdatabase.patientprofiledetails.patienthistory.dispensehistory.treatment',
    component: Loadable({
      loader: () => import('./Treatment'),
      render: (loaded, p) => {
        let Cmpnet = loaded.default
        return <Cmpnet {...props} {...p} fieldName='treatment' />
      },
      loading: Loading,
    }),
  },
]
