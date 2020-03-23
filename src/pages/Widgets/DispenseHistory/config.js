import Loadable from 'react-loadable'
import Loading from '@/components/PageLoading/index'

export const WIDGETS_ID = {
  MEDICATION: '1',
  CONSUMABLE: '2',
  VACCINATION: '3',
  SERVICE: '4',
  TREATMENT: '5',
}

export const widgets = (props) => [
  {
    id: WIDGETS_ID.MEDICATION,
    name: 'Medication',
    authority: 'patientdatabase.patientprofiledetails.patienthistory.dispensehistory.medication',
    component: Loadable({
      loader: () => import('./Medication'),
      render: (loaded, p) => {
        let Cmpnet = loaded.default
        return <Cmpnet {...props} {...p} fieldName='Medication' />
      },
      loading: Loading,
    }),
  },
  {
    id: WIDGETS_ID.CONSUMABLE,
    name: 'Consumable',
    authority: 'patientdatabase.patientprofiledetails.patienthistory.dispensehistory.consumable',
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
    id: WIDGETS_ID.VACCINATION,
    name: 'Vaccination',
    authority: 'patientdatabase.patientprofiledetails.patienthistory.dispensehistory.vaccination',
    component: Loadable({
      loader: () => import('./Vaccination'),
      render: (loaded, p) => {
        let Cmpnet = loaded.default
        return <Cmpnet {...props} {...p} fieldName='vaccination' />
      },
      loading: Loading,
    }),
  },
  {
    id: WIDGETS_ID.SERVICE,
    name: 'Service',
    authority: 'patientdatabase.patientprofiledetails.patienthistory.dispensehistory.service',
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
    authority: 'patientdatabase.patientprofiledetails.patienthistory.dispensehistory.treatment',
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
