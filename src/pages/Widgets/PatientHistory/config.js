import Loadable from 'react-loadable'
import Loading from '@/components/PageLoading/index'
import { scribbleTypes } from '@/utils/codes'

export const WIDGETS_ID = {
  CLINICAL_NOTE: '1',
  CHIEF_COMPLAINTS: '2',
  ASSOCIATED_HISTORY: '3',
  INTRA_ORAL: '4',
  EXTRA_ORAL: '5',
  ATTACHMENT: '6',
  ORDERS: '7',
  INVOICE: '8',
  DENTAL_CHART: '9',
  TREATMENT: '10',
  PLAN: '11',
  DIAGNOSIS: '12',
  VISUALACUITYTEST: '13',
  FORMS: '14',
  EXAMINATIONFORM: '15',
  REFRACTIONFORM: '16',
  VISITREMARKS: '17',
  VITALSIGN: '18',
  REFERRAL: '19',
  CONSULTATION_DOCUMENT: '20',
}

export const notesTypes = [
  { value: WIDGETS_ID.ASSOCIATED_HISTORY, fieldName: 'history' },
  { value: WIDGETS_ID.CHIEF_COMPLAINTS, fieldName: 'chiefComplaints' },
  { value: WIDGETS_ID.CLINICAL_NOTE, fieldName: 'note' },
  { value: WIDGETS_ID.PLAN, fieldName: 'plan' },
  { value: WIDGETS_ID.INTRA_ORAL, fieldName: 'intraOral' },
  { value: WIDGETS_ID.EXTRA_ORAL, fieldName: 'extraOral' },
  { value: WIDGETS_ID.VISITREMARKS, fieldName: 'visitRemarks' },
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
      'queue.consultation.widgets.vitalsign',
    ],
    children: [
      WIDGETS_ID.ASSOCIATED_HISTORY,
      WIDGETS_ID.CHIEF_COMPLAINTS,
      WIDGETS_ID.CLINICAL_NOTE,
      WIDGETS_ID.PLAN,
      WIDGETS_ID.DIAGNOSIS,
      WIDGETS_ID.INTRA_ORAL,
      WIDGETS_ID.EXTRA_ORAL,
      WIDGETS_ID.VISUALACUITYTEST,
      WIDGETS_ID.REFRACTIONFORM,
      WIDGETS_ID.EXAMINATIONFORM,
      WIDGETS_ID.VISITREMARKS,
      WIDGETS_ID.VITALSIGN,
      WIDGETS_ID.REFERRAL,
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
      WIDGETS_ID.ORDERS,
      WIDGETS_ID.DENTAL_CHART,
      WIDGETS_ID.TREATMENT,
      WIDGETS_ID.INVOICE,
    ],
  },
  {
    value: 'ConsultationDocuments',
    name: 'Consultation Documents',
    authority: [
      'queue.consultation.widgets.consultationdocument',
      'queue.consultation.widgets.forms',
      'queue.consultation.widgets.attachment',
    ],
    children: [
      WIDGETS_ID.CONSULTATION_DOCUMENT,
      WIDGETS_ID.FORMS,
      WIDGETS_ID.ATTACHMENT,
    ],
  },
]

export const widgets = (props, scribbleNoteUpdateState = () => {}) => [
  {
    id: WIDGETS_ID.ASSOCIATED_HISTORY,
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
    id: WIDGETS_ID.CHIEF_COMPLAINTS,
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
    id: WIDGETS_ID.CLINICAL_NOTE,
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
    id: WIDGETS_ID.PLAN,
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
    id: WIDGETS_ID.VISITREMARKS,
    name: 'Visit Remarks',
    authority: '',
    component: Loadable({
      loader: () => import('./Notes'),
      render: (loaded, p) => {
        let Cmpnet = loaded.default
        return <Cmpnet {...props} {...p} fieldName='visitRemarks' />
      },
      loading: Loading,
    }),
  },
  {
    id: WIDGETS_ID.REFERRAL,
    name: 'Referral',
    authority: '',
    component: Loadable({
      loader: () => import('./Notes'),
      render: (loaded, p) => {
        let Cmpnet = loaded.default
        return <Cmpnet {...props} {...p} fieldName='visitReferral' />
      },
      loading: Loading,
    }),
  },

  {
    id: WIDGETS_ID.VITALSIGN,
    name: 'Vital Sign',
    authority: 'queue.consultation.widgets.vitalsign',
    component: Loadable({
      loader: () => import('./VitalSign'),
      render: (loaded, p) => {
        let Cmpnet = loaded.default
        return <Cmpnet {...props} {...p} />
      },
      loading: Loading,
    }),
  },
  {
    id: WIDGETS_ID.DIAGNOSIS,
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
    id: WIDGETS_ID.INTRA_ORAL,
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
    id: WIDGETS_ID.EXTRA_ORAL,
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
    id: WIDGETS_ID.ORDERS,
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
    id: WIDGETS_ID.DENTAL_CHART,
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
    id: WIDGETS_ID.TREATMENT,
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
    id: WIDGETS_ID.INVOICE,
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
    id: WIDGETS_ID.VISUALACUITYTEST,
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
    id: WIDGETS_ID.REFRACTIONFORM,
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
    id: WIDGETS_ID.EXAMINATIONFORM,
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
    id: WIDGETS_ID.FORMS,
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
  {
    id: WIDGETS_ID.ATTACHMENT,
    name: 'Attachment',
    authority: 'queue.consultation.widgets.attachment',
    component: Loadable({
      loader: () => import('./Attachment'),
      render: (loaded, p) => {
        let Cmpnet = loaded.default
        return <Cmpnet {...props} {...p} />
      },
      loading: Loading,
    }),
  },
]

export const showWidget = (current, widget) => {
  // check show notes
  const notesType = notesTypes.find((type) => type.value === widget.id)

  if (notesType) {
    const { scribbleNotes = [] } = current
    const scribbleType = scribbleTypes.find(
      (o) => o.type === notesType.fieldName,
    )
    if (
      !current[notesType.fieldName] &&
      (!scribbleType ||
        scribbleNotes.filter(
          (o) => o.scribbleNoteTypeFK === scribbleType.typeFK,
        ).length === 0)
    )
      return false
  }

  // check show diagnosis
  if (
    widget.id === WIDGETS_ID.DIAGNOSIS &&
    (!current.diagnosis || current.diagnosis.length === 0)
  )
    return false

  // check show eyevisualacuity
  if (
    widget.id === WIDGETS_ID.VISUALACUITYTEST &&
    (!current.eyeVisualAcuityTestForms ||
      current.eyeVisualAcuityTestForms.length === 0)
  )
    return false

  // check show eyerefractionform
  if (
    widget.id === WIDGETS_ID.REFRACTIONFORM &&
    (!current.corEyeRefractionForm ||
      JSON.stringify(current.corEyeRefractionForm.formData) === '{}')
  )
    return false

  // check show eyeexaminationform
  if (
    widget.id === WIDGETS_ID.EXAMINATIONFORM &&
    (!current.corEyeExaminationForm ||
      JSON.stringify(current.corEyeExaminationForm.formData) === '{}' ||
      (current.corEyeExaminationForm.formData.EyeExaminations || []).length ===
        0)
  )
    return false

  // check show forms
  if (
    widget.id === WIDGETS_ID.FORMS &&
    (!current.forms || current.forms.length === 0)
  )
    return false
  // check show attachments
  if (
    widget.id === WIDGETS_ID.ATTACHMENT &&
    (current.attachments || current.visitAttachments || []).length === 0
  ) {
    return false
  }
  // check show orders
  if (
    widget.id === WIDGETS_ID.ORDERS &&
    (!current.orders || current.orders.length === 0)
  )
    return false
  // check show document
  if (
    widget.id === WIDGETS_ID.CONSULTATION_DOCUMENT &&
    (!current.documents || current.documents.length === 0)
  )
    return false
  // check show DentalChart
  if (
    widget.id === WIDGETS_ID.DENTAL_CHART &&
    (!current.dentalChart || current.dentalChart.length === 0)
  )
    return false
  // check show invoice
  if (widget.id === WIDGETS_ID.INVOICE && !current.invoice) return false

  // check show treatment
  if (
    widget.id === WIDGETS_ID.TREATMENT &&
    (!current.orders ||
      current.orders.filter((o) => o.type === 'Treatment').length === 0)
  )
    return false
  // check show vital sign
  if (
    widget.id === WIDGETS_ID.VITALSIGN &&
    (!current.patientNoteVitalSigns ||
      current.patientNoteVitalSigns.length === 0)
  )
    return false
  // check show visit referral
  if (widget.id === WIDGETS_ID.REFERRAL) {
    const { referralBy, referralInstitution, referralDate } = current
    if (
      (!referralBy || referralBy === '') &&
      (!referralInstitution || referralInstitution === '') &&
      !referralDate
    )
      return false
  }

  return true
}
