import Loadable from 'react-loadable'
import Loading from '@/components/PageLoading/index'

export const WIDGETS_ID = {
  CLINICAL_NOTE: '1',
  CHIEF_COMPLAINTS: '2',
  PLAN: '3',
  ASSOCIATED_HISTORY: '3',
  INTRA_ORAL: '4',
  EXTRA_ORAL: '5',
  ATTACHMENT: '6',
  ORDERS: '7',
  INVOICE: '8',
  DENTAL_CHART: '9',
  TREATMENT: '10',
}

export const widgets = (props) => [
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
    id: '11',
    name: 'Plan',
    component: Loadable({
      loader: () => import('./Notes'),
      render: (loaded, p) => {
        let Cmpnet = loaded.default
        return <Cmpnet {...props} {...p} fieldName='plan' />
      },
      loading: Loading,
    }),
  },
  {
    id: '12',
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
    id: '13',
    name: 'Visual Acuity',
    component: Loadable({
      loader: () => import('../EyeVisualAcuity/VisualAcuityWithoutAuthority'),
      render: (loaded, p) => {
        let Cmpnet = loaded.default
        return (
          <Cmpnet
            {...props}
            {...p}
            prefix='eyeVisualAcuityTestForms'
            attachmentsFieldName='eyeVisualAcuityTestAttachments'
            fromPatientHistory
            values={p.patientHistory.entity}
          />
        )
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
    id: '9',
    name: 'Dental Chart',
    component: Loadable({
      loader: () => import('./DentalChart/index'),
      render: (loaded, p) => {
        let Cmpnet = loaded.default
        return <Cmpnet {...props} {...p} />
      },
      loading: Loading,
    }),
  },
  {
    id: '10',
    name: 'Treatment',
    component: Loadable({
      loader: () => import('./Treatment/index'),
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
