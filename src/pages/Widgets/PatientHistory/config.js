import Loadable from 'react-loadable'
import Loading from '@/components/PageLoading/index'
import { scribbleTypes } from '@/utils/codes'
import { cleanFields } from '@/pages/Consultation/utils'
import { VISIT_TYPE } from '@/utils/constants'
import _ from 'lodash'

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
  REFERRAL: '19',
  CONSULTATION_DOCUMENT: '20',
  NURSENOTES: '21',
  DOCTORNOTE: '22',
}

export const GPCategory = [
  WIDGETS_ID.ASSOCIATED_HISTORY,
  WIDGETS_ID.CHIEF_COMPLAINTS,
  WIDGETS_ID.CLINICAL_NOTE,
  WIDGETS_ID.PLAN,
  WIDGETS_ID.DIAGNOSIS,
  WIDGETS_ID.VISITREMARKS,
  WIDGETS_ID.REFERRAL,
  WIDGETS_ID.ORDERS,
  WIDGETS_ID.INVOICE,
  WIDGETS_ID.CONSULTATION_DOCUMENT,
  WIDGETS_ID.FORMS,
  WIDGETS_ID.ATTACHMENT,
  WIDGETS_ID.NURSENOTES,
]

export const EyeCategory = [
  WIDGETS_ID.ASSOCIATED_HISTORY,
  WIDGETS_ID.CHIEF_COMPLAINTS,
  WIDGETS_ID.CLINICAL_NOTE,
  WIDGETS_ID.PLAN,
  WIDGETS_ID.DIAGNOSIS,
  WIDGETS_ID.VISUALACUITYTEST,
  WIDGETS_ID.REFRACTIONFORM,
  WIDGETS_ID.EXAMINATIONFORM,
  WIDGETS_ID.VISITREMARKS,
  WIDGETS_ID.REFERRAL,
  WIDGETS_ID.ORDERS,
  WIDGETS_ID.INVOICE,
  WIDGETS_ID.CONSULTATION_DOCUMENT,
  WIDGETS_ID.FORMS,
  WIDGETS_ID.ATTACHMENT,
  WIDGETS_ID.NURSENOTES,
]

export const DentalCategory = [
  WIDGETS_ID.ASSOCIATED_HISTORY,
  WIDGETS_ID.CHIEF_COMPLAINTS,
  WIDGETS_ID.CLINICAL_NOTE,
  WIDGETS_ID.PLAN,
  WIDGETS_ID.DENTAL_CHART,
  WIDGETS_ID.TREATMENT,
  WIDGETS_ID.VISITREMARKS,
  WIDGETS_ID.REFERRAL,
  WIDGETS_ID.ORDERS,
  WIDGETS_ID.INVOICE,
  WIDGETS_ID.CONSULTATION_DOCUMENT,
  WIDGETS_ID.FORMS,
  WIDGETS_ID.ATTACHMENT,
  WIDGETS_ID.NURSENOTES,
]

export const categoryTypes = [
  {
    value: WIDGETS_ID.ASSOCIATED_HISTORY,
    name: 'History',
    authority: 'queue.consultation.clinicalnotes.history',
  },
  {
    value: WIDGETS_ID.CHIEF_COMPLAINTS,
    name: 'Chief Complaints',
    authority: 'queue.consultation.clinicalnotes.chiefcomplaints',
  },
  {
    value: WIDGETS_ID.CLINICAL_NOTE,
    name: 'Clinic Notes',
    authority: 'queue.consultation.clinicalnotes.clinicalnotes',
  },
  {
    value: WIDGETS_ID.PLAN,
    name: 'Plan',
    authority: 'queue.consultation.clinicalnotes.plan',
  },
  {
    value: WIDGETS_ID.DENTAL_CHART,
    name: 'Dental Chart',
    authority: 'queue.consultation.widgets.dentalchart',
  },
  {
    value: WIDGETS_ID.TREATMENT,
    name: 'Treatment',
    authority: 'queue.consultation.widgets.dentalchart',
  },
  {
    value: WIDGETS_ID.DIAGNOSIS,
    name: 'Diagnosis',
    authority: 'queue.consultation.widgets.diagnosis',
  },
  {
    value: WIDGETS_ID.VISUALACUITYTEST,
    name: 'Visual Acuity Test',
    shortname: 'Visual Acuity',
    authority: 'queue.consultation.widgets.eyevisualacuity',
  },
  {
    value: WIDGETS_ID.REFRACTIONFORM,
    name: 'Refraction Form',
    authority: 'queue.consultation.widgets.eyerefractionform',
  },
  {
    value: WIDGETS_ID.EXAMINATIONFORM,
    name: 'Examination Form',
    authority: 'queue.consultation.widgets.eyeexaminationform',
  },
  {
    value: WIDGETS_ID.VISITREMARKS,
    name: 'Visit Remarks',
    authority: 'queue.visitregistrationdetails',
  },
  {
    value: WIDGETS_ID.REFERRAL,
    name: 'Referral',
    authority: '',
  },
  {
    value: WIDGETS_ID.ORDERS,
    name: 'Order',
    authority: 'queue.consultation.widgets.order',
  },
  {
    value: WIDGETS_ID.INVOICE,
    name: 'Invoice',
    authority: 'finance/invoicepayment',
  },
  {
    value: WIDGETS_ID.CONSULTATION_DOCUMENT,
    name: 'Consultation Document',
    shortname: 'Cons. Doc.',
    authority: 'queue.consultation.widgets.consultationdocument',
  },
  {
    value: WIDGETS_ID.FORMS,
    name: 'Forms',
    authority: 'queue.consultation.form',
  },
  {
    value: WIDGETS_ID.ATTACHMENT,
    name: 'Attachment',
    authority: 'queue.consultation.widgets.attachment',
  },
  {
    value: WIDGETS_ID.NURSENOTES,
    name: 'Notes',
    authority:
      'patientdatabase.patientprofiledetails.patienthistory.nursenotes',
  },
]

export const notesTypes = [
  {
    value: WIDGETS_ID.ASSOCIATED_HISTORY,
    fieldName: 'history',
    title: 'History',
  },
  {
    value: WIDGETS_ID.CHIEF_COMPLAINTS,
    fieldName: 'chiefComplaints',
    title: 'Chief Complaints',
  },
  { value: WIDGETS_ID.CLINICAL_NOTE, fieldName: 'note', title: 'Note' },
  { value: WIDGETS_ID.PLAN, fieldName: 'plan', title: 'Plan' },
  { value: WIDGETS_ID.INTRA_ORAL, fieldName: 'intraOral' },
  { value: WIDGETS_ID.EXTRA_ORAL, fieldName: 'extraOral' },
  { value: WIDGETS_ID.VISITREMARKS, fieldName: 'visitRemarks' },
]

export const widgets = (
  props,
  scribbleNoteUpdateState = () => {},
  getSelectNoteTypes = () => {},
) => [
  {
    id: WIDGETS_ID.DOCTORNOTE,
    name: 'Doctor Notes',
    component: Loadable({
      loader: () => import('./DoctorNotes'),
      render: (loaded, p) => {
        let Cmpnet = loaded.default
        return (
          <Cmpnet
            {...props}
            {...p}
            scribbleNoteUpdateState={scribbleNoteUpdateState}
            getSelectNoteTypes={getSelectNoteTypes}
          />
        )
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
    id: WIDGETS_ID.FORMS,
    name: 'Forms',
    authority: 'queue.consultation.form',
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

export const hasValue = value => {
  return value !== undefined && value !== null
}

export const getHistoryValueForBoolean = value => {
  return hasValue(value) ? (value ? 'Yes' : 'No') : '-'
}

const checkNote = (widgetId, current) => {
  const notesType = notesTypes.find(type => type.value === widgetId)
  if (notesType) {
    if (
      [
        WIDGETS_ID.ASSOCIATED_HISTORY,
        WIDGETS_ID.CHIEF_COMPLAINTS,
        WIDGETS_ID.CLINICAL_NOTE,
        WIDGETS_ID.PLAN,
      ].indexOf(widgetId) < 0
    ) {
      return (
        hasValue(current[notesType.fieldName]) &&
        current[notesType.fieldName].trim().length > 0
      )
    } else {
      const { scribbleNotes = [], doctorNotes = [] } = current
      const scribbleType = scribbleTypes.find(
        o => o.type === notesType.fieldName,
      )
      if (
        !doctorNotes.find(
          note =>
            hasValue(note[notesType.fieldName]) &&
            note[notesType.fieldName].trim().length,
        ) &&
        (!scribbleType ||
          scribbleNotes.filter(
            o => o.scribbleNoteTypeFK === scribbleType.typeFK,
          ).length === 0)
      ) {
        return false
      }
    }
    return true
  }
  return true
}

export const showWidget = (current, widgetId, selectNoteTypes = []) => {
  // check show notes
  if (!checkNote(widgetId, current)) {
    return false
  }

  // check show Dcotor Notes
  if (
    widgetId === WIDGETS_ID.DOCTORNOTE &&
    !selectNoteTypes.find(c => checkNote(c, current))
  ) {
    return false
  }

  // check show diagnosis
  if (
    widgetId === WIDGETS_ID.DIAGNOSIS &&
    (!current.diagnosis || current.diagnosis.length === 0)
  )
    return false

  // check show eyevisualacuity
  if (widgetId === WIDGETS_ID.VISUALACUITYTEST) {
    if (_.isEmpty(current.eyeVisualAcuityTestForms)) return false
    const durtyFields = [
      'concurrencyToken',
      'eyeVisualAcuityTestFK',
      'isDeleted',
    ]
    const clonForms = _.cloneDeep(current.eyeVisualAcuityTestForms)
    cleanFields(clonForms, durtyFields)
    return !_.isEmpty(clonForms)
  }

  // check show eyerefractionform
  if (widgetId === WIDGETS_ID.REFRACTIONFORM) {
    if (
      !current.corEyeRefractionForm ||
      _.isEmpty(current.corEyeRefractionForm.formData)
    )
      return false
    const durtyFields = [
      'isDeleted',
      'isNew',
      'IsSelected',
      'rowIndex',
      '_errors',
      'id',
      'EyeRefractionTestTypeFK',
    ]

    const cloneData = _.cloneDeep(current.corEyeRefractionForm.formData)
    cleanFields(cloneData, durtyFields)
    return !_.isEmpty(cloneData)
  }

  // check show eyeexaminationform
  if (widgetId === WIDGETS_ID.EXAMINATIONFORM) {
    if (
      !current.corEyeExaminationForm ||
      _.isEmpty(current.corEyeExaminationForm.formData) ||
      _.isEmpty(current.corEyeExaminationForm.formData.EyeExaminations)
    )
      return false

    const durtyFields = [
      'isDeleted',
      'isNew',
      'IsSelected',
      'rowIndex',
      '_errors',
      'id',
      'EyeExaminationTypeFK',
      'EyeExaminationType',
    ]
    const cloneExaminations = _.cloneDeep(
      current.corEyeExaminationForm.formData.EyeExaminations,
    )

    cleanFields(cloneExaminations, durtyFields)
    return !_.isEmpty(cloneExaminations)
  }

  // check show forms
  if (
    widgetId === WIDGETS_ID.FORMS &&
    (!current.forms || current.forms.length === 0)
  )
    return false
  // check show attachments
  if (
    widgetId === WIDGETS_ID.ATTACHMENT &&
    (current.attachments || current.visitAttachments || []).length === 0
  ) {
    return false
  }
  // check show orders
  if (
    widgetId === WIDGETS_ID.ORDERS &&
    (!current.orders || current.orders.length === 0) &&
    !current.isFromEditOrder
  )
    return false
  // check show document
  if (
    widgetId === WIDGETS_ID.CONSULTATION_DOCUMENT &&
    (!current.documents || current.documents.length === 0)
  )
    return false
  // check show DentalChart
  if (
    widgetId === WIDGETS_ID.DENTAL_CHART &&
    (!current.dentalChart || current.dentalChart.length === 0)
  )
    return false
  // check show invoice
  if (widgetId === WIDGETS_ID.INVOICE && !current.invoice) return false

  // check show treatment
  if (
    widgetId === WIDGETS_ID.TREATMENT &&
    (!current.orders ||
      current.orders.filter(o => o.type === 'Treatment').length === 0)
  )
    return false

  // check show visit referral
  if (widgetId === WIDGETS_ID.REFERRAL) {
    const {
      referralSourceFK,
      referralPersonFK,
      referralPatientProfileFK,
    } = current
    if (!referralSourceFK && !referralPersonFK && !referralPatientProfileFK)
      return false
  }

  return true
}

export const showNote = (
  note,
  scribbleNotes = [],
  noteType,
  visitPurposeFK,
) => {
  const scribbleType = scribbleTypes.find(o => o.type === noteType.fieldName)
  if (
    (note[noteType.fieldName] === null ||
      note[noteType.fieldName] === undefined ||
      !note[noteType.fieldName].trim().length) &&
    !scribbleNotes.find(
      s =>
        s.scribbleNoteTypeFK === scribbleType?.typeFK &&
        s.signedByUserFK === note.signedByUserFK,
    )
  ) {
    return false
  }
  return true
}
