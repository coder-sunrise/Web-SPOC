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
  CONSULTATION_DOCUMENT: '20',
  INVOICE: '8',
  DENTAL_CHART: '9',
  TREATMENT: '10',
}

export const notesTypes = [
  { value: '3', fieldName: 'history' },
  { value: '2', fieldName: 'chiefComplaints' },
  { value: '1', fieldName: 'note' },
  { value: '11', fieldName: 'plan' },
  { value: '4', fieldName: 'intraOral' },
  { value: '5', fieldName: 'extraOral' },
]

export const historyTags = [
  {
    value: 'Notes',
    name: 'Notes',
    authority: [
      'queue.consultation.clinicalnotes.history',
      'queue.consultation.clinicalnotes.chiefcomplaints',
      'queue.consultation.clinicalnotes.clinicalnotes',
      'queue.consultation.clinicalnotes.plan',
      'queue.consultation.widgets.diagnosis',
      'queue.consultation.clinicalnotes.intraoral',
      'queue.consultation.clinicalnotes.extraoral',
      'queue.consultation.widgets.eyevisualacuity',
      'queue.consultation.widgets.eyerefractionform',
      'queue.consultation.widgets.eyeexaminationform',
    ],
    children: [
      '3',
      '2',
      '1',
      '11',
      '12',
      '4',
      '5',
      '13',
      '16',
      '15',
    ],
  },
  {
    value: 'Orders',
    name: 'Orders',
    authority: [
      'queue.consultation.widgets.order',
      'queue.consultation.widgets.dentalchart',
    ],
    children: [
      '7',
      '9',
      '10',
      '8',
    ],
  },
  {
    value: 'ConsultationDocuments',
    name: 'Consultation Documents',
    authority: [
      'queue.consultation.widgets.consultationdocument',
      'queue.consultation.widgets.forms',
    ],
    children: [
      '20',
      '14',
    ],
  },
]

export const widgets = (props, scribbleNoteUpdateState = () => {}) => [
  {
    id: '3',
    name: 'History',
    authority: 'queue.consultation.clinicalnotes.history',
    component: Loadable({
      loader: () => import('./Notes'),
      render: (loaded, p) => {
        let Cmpnet = loaded.default
        return (
          <Cmpnet
            {...props}
            {...p}
            scribbleNoteUpdateState={scribbleNoteUpdateState}
            fieldName='history'
          />
        )
      },
      loading: Loading,
    }),
  },

  {
    id: '2',
    name: 'Chief Complaints',
    authority: 'queue.consultation.clinicalnotes.chiefcomplaints',
    component: Loadable({
      loader: () => import('./Notes'),
      render: (loaded, p) => {
        let Cmpnet = loaded.default
        return (
          <Cmpnet
            {...props}
            {...p}
            scribbleNoteUpdateState={scribbleNoteUpdateState}
            fieldName='chiefComplaints'
          />
        )
      },
      loading: Loading,
    }),
  },
  {
    id: '1',
    name: 'Clinical Notes',
    authority: 'queue.consultation.clinicalnotes.clinicalnotes',
    component: Loadable({
      loader: () => import('./Notes'),
      render: (loaded, p) => {
        let Cmpnet = loaded.default
        return (
          <Cmpnet
            {...props}
            {...p}
            scribbleNoteUpdateState={scribbleNoteUpdateState}
            fieldName='note'
          />
        )
      },
      loading: Loading,
    }),
  },
  {
    id: '11',
    name: 'Plan',
    authority: 'queue.consultation.clinicalnotes.plan',
    component: Loadable({
      loader: () => import('./Notes'),
      render: (loaded, p) => {
        let Cmpnet = loaded.default
        return (
          <Cmpnet
            {...props}
            scribbleNoteUpdateState={scribbleNoteUpdateState}
            {...p}
            fieldName='plan'
          />
        )
      },
      loading: Loading,
    }),
  },
  {
    id: '12',
    name: 'Diagnosis',
    authority: 'queue.consultation.widgets.diagnosis',
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
  // {
  //   id: '6',
  //   name: 'Attachment',
  //   authority: 'queue.consultation.widgets.attachment',
  //   component: Loadable({
  //     loader: () => import('./Attachment'),
  //     render: (loaded, p) => {
  //       let Cmpnet = loaded.default
  //       return <Cmpnet {...props} {...p} />
  //     },
  //     loading: Loading,
  //   }),
  // },
  {
    id: '7',
    name: 'Orders',
    authority: 'queue.consultation.widgets.order',
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
    id: WIDGETS_ID.CONSULTATION_DOCUMENT,
    name: 'Consultation Document',
    authority: 'queue.consultation.widgets.consultationdocument',
    component: Loadable({
      loader: () => import('./ConsultationDocument'),
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
    authority: 'queue.consultation.widgets.order',
    component: Loadable({
      loader: () => import('./Invoice'),
      render: (loaded, p) => {
        let Cmpnet = loaded.default
        return <Cmpnet {...props} {...p} />
      },
      loading: Loading,
    }),
  },
  {
    id: '13',
    name: 'Visual Acuity Test',
    authority: 'queue.consultation.widgets.eyevisualacuity',
    component: Loadable({
      loader: () => import('./EyeVisualAcuity/index'),
      render: (loaded, p) => {
        let Cmpnet = loaded.default
        return <Cmpnet {...props} {...p} />
      },
      loading: Loading,
    }),
  },
  {
    id: '16',
    name: 'Refraction Form',
    authority: 'queue.consultation.widgets.eyerefractionform',
    component: Loadable({
      loader: () => import('./RefractionForm/index'),
      render: (loaded, p) => {
        let Cmpnet = loaded.default
        return <Cmpnet {...props} {...p} />
      },
      loading: Loading,
    }),
    layoutConfig: {},
  },
  {
    id: '15',
    name: 'Examination Form',
    authority: 'queue.consultation.widgets.eyeexaminationform',
    component: Loadable({
      loader: () => import('./ExaminationForm'),
      render: (loaded, p) => {
        let Cmpnet = loaded.default
        return <Cmpnet {...props} {...p} />
      },
      loading: Loading,
    }),
    layoutConfig: {},
  },
  {
    id: '14',
    name: 'Forms',
    authority: 'queue.consultation.widgets.forms',
    component: Loadable({
      loader: () => import('./Forms'),
      render: (loaded, p) => {
        let Cmpnet = loaded.default
        return <Cmpnet {...props} {...p} />
      },
      loading: Loading,
    }),
  },
]
