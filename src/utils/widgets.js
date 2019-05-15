import Loadable from 'react-loadable'
import Loading from '@/components/PageLoading/index'

const widgets = [
  {
    id: 1,
    name: 'Patient Data',
    component: Loadable({
      loader: () => import('@/pages/PatientDatabase/Detail'),
      loading: Loading,
    }),
    layoutConfig: {
      minW: 12,
      minH: 10,
    },
  },
  {
    id: 2,
    name: 'Patient List',
    component: Loadable({
      loader: () => import('@/pages/PatientDatabase/Search'),
      loading: Loading,
    }),
    layoutConfig: {
      minW: 12,
      minH: 10,
    },
  },
]

module.exports = {
  widgets,
  ...module.exports,
}
