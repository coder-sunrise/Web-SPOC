import { Fragment } from 'react'
import Loadable from 'react-loadable'
// material ui
import Add from '@material-ui/icons/Add'
// common components
import Loading from '@/components/PageLoading/index'
import { Tooltip, AuthorizedContext, IconButton } from '@/components'
// utils
import { CLINIC_TYPE } from '@/utils/constants'
import Authorized from '@/utils/Authorized'

const clinicInfo = JSON.parse(localStorage.getItem('clinicInfo') || {})
const clinicSetting = JSON.parse(localStorage.getItem('clinicSettings') || '{}')
const { clinicTypeFK = CLINIC_TYPE.GP } = clinicInfo
const widgets = [
  {
    id: '1',
    name: 'Clinical Notes',
    accessRight: 'queue.consultation.widgets.clinicalnotes',
    component: Loadable({
      loader: () => import('@/pages/Widgets/ClinicalNotes'),
      loading: Loading,
    }),
    model: 'clinicalnotes',
    persist: true,
    disabled: true,
    layoutConfig: {
      minW: 12,
      minH: 7,
      style: {
        padding: '5px',
      },
    },
    toolbarAddon: (
      <AuthorizedContext>
        {r => {
          if (r.rights !== 'enable') return null
          return null
        }}
      </AuthorizedContext>
    ),
  },
  {
    id: '2',
    name: 'Diagnosis',
    accessRight: 'queue.consultation.widgets.diagnosis',
    component: Loadable({
      loader: () =>
        clinicSetting.diagnosisDataSource === 'Snomed'
          ? import('@/pages/Widgets/Diagnosis')
          : import('@/pages/Widgets/ICD10Diagnosis'),
      loading: Loading,
    }),
    model: 'diagnosis',
    associatedProps: ['corDiagnosis'],
    layoutConfig: {
      minW: 12,
      minH: 10,
      style: {
        padding: 5,
      },
    },
  },
  {
    id: '3',
    name: 'Consultation Document',
    shortName: 'Cons. Doc.',
    accessRight: 'queue.consultation.widgets.consultationdocument',
    component: Loadable({
      loader: () => import('@/pages/Widgets/ConsultationDocument'),
      loading: Loading,
    }),
    model: 'consultationDocument',
    layoutConfig: {},

    onRemove: () => {
      window.g_app._store.dispatch({
        type: 'consultationDocument/deleteRow',
      })
    },
  },
  {
    id: '4',
    name: 'Visit History',
    accessRight: 'queue.consultation.widgets.patienthistory',
    component: Loadable({
      loader: () =>
        import('@/pages/Widgets/PatientHistory/consultationDisplay'),
      render: (loaded, p) => {
        let Cmpnet = loaded.default
        return <Cmpnet {...p} widget mode='integrated' />
      },
      loading: Loading,
    }),
    model: 'patientHistory',
    disableDeleteWarning: true,
    layoutConfig: {
      style: {
        padding: 5,
      },
    },
  },
  {
    id: '5',
    name: 'Orders',
    accessRight: 'queue.consultation.widgets.order',
    component: Loadable({
      loader: () => import('@/pages/Widgets/Orders'),
      loading: Loading,
      render: (loaded, p) => {
        let Cmpnet = loaded.default
        return <Cmpnet {...p} widget />
      },
    }),
    model: 'orders',
    onRemove: () => {
      window.g_app._store.dispatch({
        type: 'orders/deleteRow',
      })
    },
    layoutConfig: {
      style: {
        padding: '0 5px',
      },
    },
  },
  {
    id: '12',
    name: 'Forms',
    accessRight: 'queue.consultation.form',
    component: Loadable({
      loader: () => import('@/pages/Widgets/Forms'),
      loading: Loading,
    }),
    model: 'forms',
    layoutConfig: {},

    onRemove: () => {
      window.g_app._store.dispatch({
        type: 'forms/deleteRow',
      })
    },
  },
]
export { widgets }
