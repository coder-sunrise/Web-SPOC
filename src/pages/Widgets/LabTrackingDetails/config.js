import Loadable from 'react-loadable'
import Loading from '@/components/PageLoading/index'

export const WIDGETS_ID = {
  EXTERNALTRACKING_DETAILS: 1,
  EXTERNALTRACKING_ORDERFORM: 2,
}

export const widgets = props => [
  {
    id: WIDGETS_ID.EXTERNALTRACKING_DETAILS,
    name: 'External Tracking Details',
    component: Loadable({
      loader: () => import('./ExternalTrackingDetails'),
      render: (loaded, p) => {
        let Cmpnet = loaded.default
        return <Cmpnet {...props} {...p} />
      },
      loading: Loading,
    }),
  },
  {
    id: WIDGETS_ID.EXTERNALTRACKING_ORDERFORM,
    name: 'Order Form',
    component: Loadable({
      loader: () => import('./ExternalTrackingOrderForm'),
      render: (loaded, p) => {
        let Cmpnet = loaded.default
        return <Cmpnet {...props} {...p} />
      },
      loading: Loading,
    }),
  },
]
