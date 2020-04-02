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
    authority: 'byPass',
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
    authority: 'byPass',
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
    authority: 'byPass',
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
    authority: 'byPass',
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
    authority: 'queue.consultation.widgets.eyevisualacuity',
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
    authority: 'byPass',
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
    authority: 'queue.consultation.clinicalnotes.intraoral',
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
    authority: 'queue.consultation.clinicalnotes.extraoral',
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
    authority: 'byPass',
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
    authority: 'byPass',
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
    authority: 'queue.consultation.widgets.dentalchart',
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
    authority: 'queue.consultation.widgets.dentalchart',
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
