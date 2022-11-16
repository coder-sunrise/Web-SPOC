import Loadable from 'react-loadable'
import Loading from '@/components/PageLoading/index'
import { scribbleTypes } from '@/utils/codes'
import { cleanFields } from '@/pages/Consultation/utils'
import { VISIT_TYPE, CLINICALNOTE_FORMTHUMBNAIL } from '@/utils/constants'
import { getIn } from 'formik'
import _ from 'lodash'
import PosteriorEyeExamination from '@/assets/img/ClinicalNoteForm/PosteriorEyeExamination.jpg'

export const WIDGETS_ID = {
  ClINICALNOTES: '-99',
  PATIENTHISTORY: '1',
  VISIONREFRACTION: '2',
  PRELIMINARYASSESSMENT: '3',
  ANTERIOREYEEXAMINATION: '4',
  POSTERIOREYEEXAMINATION: '5',
  MANAGEMENT: '6',
  CONTACTLENSFITTING: '7',
  BINOCULARVISION: '8',
  PAEDIATRIC: '9',
  INVESTIGATIVETESTS: '10',
  FOLLOWUP: '11',
  CONSULTATION_DOCUMENT: '12',
  DIAGNOSIS: '13',
  INVOICE: '14',
  NURSENOTES: '15',
  ORDERS: '16',
  VISITREMARKS: '17',
}

export const GPCategory = [
  WIDGETS_ID.PATIENTHISTORY,
  WIDGETS_ID.VISIONREFRACTION,
  WIDGETS_ID.PRELIMINARYASSESSMENT,
  WIDGETS_ID.ANTERIOREYEEXAMINATION,
  WIDGETS_ID.POSTERIOREYEEXAMINATION,
  WIDGETS_ID.MANAGEMENT,
  WIDGETS_ID.CONTACTLENSFITTING,
  WIDGETS_ID.BINOCULARVISION,
  WIDGETS_ID.PAEDIATRIC,
  WIDGETS_ID.INVESTIGATIVETESTS,
  WIDGETS_ID.FOLLOWUP,
  WIDGETS_ID.CONSULTATION_DOCUMENT,
  WIDGETS_ID.DIAGNOSIS,
  WIDGETS_ID.INVOICE,
  WIDGETS_ID.NURSENOTES,
  WIDGETS_ID.ORDERS,
  WIDGETS_ID.VISITREMARKS,
]

export const categoryTypes = [
  {
    value: WIDGETS_ID.PATIENTHISTORY,
    name: 'Patient History',
    title: 'Clinical Notes',
  },
  {
    value: WIDGETS_ID.VISIONREFRACTION,
    name: 'Vision and Refraction',
    title: 'Clinical Notes',
  },
  {
    value: WIDGETS_ID.PRELIMINARYASSESSMENT,
    name: 'Preliminary Assessment',
    title: 'Clinical Notes',
  },
  {
    value: WIDGETS_ID.ANTERIOREYEEXAMINATION,
    name: 'Anterior Eye',
    title: 'Clinical Notes',
  },
  {
    value: WIDGETS_ID.POSTERIOREYEEXAMINATION,
    name: 'Posterior Eye',
    title: 'Clinical Notes',
  },
  {
    value: WIDGETS_ID.MANAGEMENT,
    name: 'Management',
    title: 'Clinical Notes',
  },
  {
    value: WIDGETS_ID.CONTACTLENSFITTING,
    name: 'Contact Lens Fitting',
    title: 'Clinical Notes',
  },
  {
    value: WIDGETS_ID.BINOCULARVISION,
    name: 'Binocular Vision',
    title: 'Clinical Notes',
  },
  {
    value: WIDGETS_ID.PAEDIATRIC,
    name: 'Paediatric',
    title: 'Clinical Notes',
  },
  {
    value: WIDGETS_ID.INVESTIGATIVETESTS,
    name: 'Investigative Tests',
    title: 'Clinical Notes',
  },
  {
    value: WIDGETS_ID.FOLLOWUP,
    name: 'Follow-up',
    title: 'Clinical Notes',
  },
  {
    value: WIDGETS_ID.CONSULTATION_DOCUMENT,
    name: 'Cons. Document',
    shortname: 'Cons. Document',
    authority: 'queue.consultation.widgets.consultationdocument',
  },
  {
    value: WIDGETS_ID.DIAGNOSIS,
    name: 'Diagnosis',
    authority: 'queue.consultation.widgets.diagnosis',
  },
  {
    value: WIDGETS_ID.INVOICE,
    name: 'Invoice',
    authority: 'finance/invoicepayment',
  },
  {
    value: WIDGETS_ID.NURSENOTES,
    name: 'Notes',
    authority:
      'patientdatabase.patientprofiledetails.patienthistory.nursenotes',
  },
  {
    value: WIDGETS_ID.VISITREMARKS,
    name: 'Visit Remarks',
    authority: 'queue.visitregistrationdetails',
  },
]

export const widgets = (props, scribbleNoteUpdateState = () => {}) => [
  {
    id: WIDGETS_ID.ClINICALNOTES,
    name: 'Clinical Notes',
    //authority: 'queue.consultation.widgets.consultationdocument',
    component: Loadable({
      loader: () => import('./ClinicalNote'),
      render: (loaded, p) => {
        let Cmpnet = loaded.default
        return (
          <Cmpnet
            {...props}
            {...p}
            scribbleNoteUpdateState={scribbleNoteUpdateState}
          />
        )
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
]

export const formWidgets = (props, scribbleNoteUpdateState = () => {}) => [
  {
    id: WIDGETS_ID.PATIENTHISTORY,
    name: 'Patient History',
    prop: 'doctorNote.corPatientHistory',
    component: Loadable({
      loader: () => import('./ClinicalNote/PatientHistory'),
      render: (loaded, p) => {
        let Cmpnet = loaded.default
        return <Cmpnet {...props} {...p} />
      },
      loading: Loading,
    }),
  },
  {
    id: WIDGETS_ID.VISIONREFRACTION,
    name: 'Vision and Refraction',
    prop: 'doctorNote.corVisionRefraction',
    component: Loadable({
      loader: () => import('./ClinicalNote/VisionRefraction'),
      render: (loaded, p) => {
        let Cmpnet = loaded.default
        return <Cmpnet {...props} {...p} />
      },
      loading: Loading,
    }),
  },
  {
    id: WIDGETS_ID.PRELIMINARYASSESSMENT,
    name: 'Preliminary Assessment',
    prop: 'doctorNote.corPreliminaryAssessment',
    component: Loadable({
      loader: () => import('./ClinicalNote/PreliminaryAssessment'),
      render: (loaded, p) => {
        let Cmpnet = loaded.default
        return <Cmpnet {...props} {...p} />
      },
      loading: Loading,
    }),
  },
  {
    id: WIDGETS_ID.ANTERIOREYEEXAMINATION,
    name: 'Anterior Eye',
    prop: 'doctorNote.corAnteriorEyeExamination',
    component: Loadable({
      loader: () => import('./ClinicalNote/AnteriorEyeExamination'),
      render: (loaded, p) => {
        let Cmpnet = loaded.default
        return (
          <Cmpnet
            {...props}
            {...p}
            scribbleNoteUpdateState={scribbleNoteUpdateState}
          />
        )
      },
      loading: Loading,
    }),
    cavanSize: { width: 600, height: 300 },
    imageSize: { width: 250, height: 200 },
    position: { left: 175, top: 50 },
    thumbnailDisplaySize: { width: 260, height: 130 },
    defaultThumbnail: CLINICALNOTE_FORMTHUMBNAIL.POSTERIOREYEEXAMINATION,
    defaultImage: PosteriorEyeExamination,
  },
  {
    id: WIDGETS_ID.POSTERIOREYEEXAMINATION,
    name: 'Posterior Eye',
    prop: 'doctorNote.corPosteriorEyeExamination',
    component: Loadable({
      loader: () => import('./ClinicalNote/PosteriorEyeExamination'),
      render: (loaded, p) => {
        let Cmpnet = loaded.default
        return (
          <Cmpnet
            {...props}
            {...p}
            scribbleNoteUpdateState={scribbleNoteUpdateState}
          />
        )
      },
      loading: Loading,
    }),
    cavanSize: { width: 600, height: 300 },
    imageSize: { width: 250, height: 200 },
    position: { left: 175, top: 50 },
    thumbnailDisplaySize: { width: 260, height: 130 },
    defaultThumbnail: CLINICALNOTE_FORMTHUMBNAIL.POSTERIOREYEEXAMINATION,
    defaultImage: PosteriorEyeExamination,
  },
  {
    id: WIDGETS_ID.MANAGEMENT,
    name: 'Management',
    prop: 'doctorNote.corManagement',
    component: Loadable({
      loader: () => import('./ClinicalNote/Management'),
      render: (loaded, p) => {
        let Cmpnet = loaded.default
        return <Cmpnet {...props} {...p} />
      },
      loading: Loading,
    }),
  },
  {
    id: WIDGETS_ID.CONTACTLENSFITTING,
    name: 'Contact Lens Fitting',
    prop: 'doctorNote.corContactLensFitting',
    component: Loadable({
      loader: () => import('./ClinicalNote/ContactLensFitting'),
      render: (loaded, p) => {
        let Cmpnet = loaded.default
        return <Cmpnet {...props} {...p} />
      },
      loading: Loading,
    }),
  },
  {
    id: WIDGETS_ID.BINOCULARVISION,
    name: 'Binocular Vision',
    prop: 'doctorNote.corBinocularVision',
    component: Loadable({
      loader: () => import('./ClinicalNote/BinocularVision'),
      render: (loaded, p) => {
        let Cmpnet = loaded.default
        return <Cmpnet {...props} {...p} />
      },
      loading: Loading,
    }),
  },
  {
    id: WIDGETS_ID.PAEDIATRIC,
    name: 'Paediatric',
    prop: 'doctorNote.corPaediatric',
    component: Loadable({
      loader: () => import('./ClinicalNote/Paediatric'),
      render: (loaded, p) => {
        let Cmpnet = loaded.default
        return <Cmpnet {...props} {...p} />
      },
      loading: Loading,
    }),
  },
  {
    id: WIDGETS_ID.INVESTIGATIVETESTS,
    name: 'Investigative Tests',
    prop: 'doctorNote.corInvestigativeTests',
    component: Loadable({
      loader: () => import('./ClinicalNote/InvestigativeTests'),
      render: (loaded, p) => {
        let Cmpnet = loaded.default
        return <Cmpnet {...props} {...p} />
      },
      loading: Loading,
    }),
  },
  {
    id: WIDGETS_ID.FOLLOWUP,
    name: 'Follow-up',
    prop: 'doctorNote.corFollowUp',
    component: Loadable({
      loader: () => import('./ClinicalNote/FollowUp'),
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

export const showWidget = (current, widgetId, selectForms) => {
  // check show diagnosis
  if (
    widgetId === WIDGETS_ID.DIAGNOSIS &&
    (!current.diagnosis || current.diagnosis.length === 0)
  )
    return false
  // check show orders
  if (
    widgetId === WIDGETS_ID.ORDERS &&
    (!current.orders || current.orders.length === 0)
  )
    return false
  // check show document
  if (
    widgetId === WIDGETS_ID.CONSULTATION_DOCUMENT &&
    (!current.documents || current.documents.length === 0)
  )
    return false
  // check show invoice
  if (widgetId === WIDGETS_ID.INVOICE && !current.invoice) return false
  // check visit remarks
  if (
    widgetId === WIDGETS_ID.VISITREMARKS &&
    (!hasValue(current.visitRemarks) ||
      current.visitRemarks.trim().length === 0)
  )
    return false
  // check clinical Notes
  if (
    widgetId === WIDGETS_ID.ClINICALNOTES &&
    !selectForms.find(form => {
      const formContent = getIn(current, form.prop)
      return formContent && formContent.length > 0
    })
  )
    return false
  return true
}
