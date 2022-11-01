import Loadable from 'react-loadable'
import { SCRIBBLE_NOTE_TYPE, CANNED_TEXT_TYPE } from '@/utils/constants'
import Loading from '@/components/PageLoading/index'

export const defaultConfigs = {
  fields: [
    {
      authority: 'queue.consultation.clinicalnotes.history',
      category: 'History',
      fieldName: 'history',
      fieldTitle: 'History',
      scribbleField: 'historyScribbleArray',
      scribbleNoteTypeFK: SCRIBBLE_NOTE_TYPE.HISTORY,
      cannedTextTypeFK: CANNED_TEXT_TYPE.HISTORY,
      index: 0,
      height: 390,
      enableSetting: 'isEnableClinicNoteHistory',
    },
    {
      authority: 'queue.consultation.clinicalnotes.chiefcomplaints',
      category: 'ChiefComplaints',
      fieldName: 'chiefComplaints',
      fieldTitle: 'Chief Complaints',
      scribbleField: 'chiefComplaintsScribbleArray',
      scribbleNoteTypeFK: SCRIBBLE_NOTE_TYPE.CHIEFCOMPLAINTS,
      cannedTextTypeFK: CANNED_TEXT_TYPE.CHIEFCOMPLAINTS,
      index: 1,
      height: 390,
      enableSetting: 'isEnableClinicNoteChiefComplaints',
    },
    {
      authority: 'queue.consultation.clinicalnotes.clinicalnotes',
      category: 'Note',
      fieldName: 'note',
      fieldTitle: 'Clinical Notes',
      scribbleField: 'notesScribbleArray',
      scribbleNoteTypeFK: SCRIBBLE_NOTE_TYPE.CLINICALNOTES,
      cannedTextTypeFK: CANNED_TEXT_TYPE.NOTE,
      index: 2,
      height: 390,
      enableSetting: 'isEnableClinicNotes',
    },
    {
      authority: 'queue.consultation.clinicalnotes.plan',
      category: 'Plan',
      fieldName: 'plan',
      fieldTitle: 'Plan',
      scribbleField: 'planScribbleArray',
      scribbleNoteTypeFK: SCRIBBLE_NOTE_TYPE.PLAN,
      cannedTextTypeFK: CANNED_TEXT_TYPE.PLAN,
      index: 3,
      height: 390,
      enableSetting: 'isEnableClinicNotePlan',
    },
  ],
}

export const formConfigs = [
  {
    id: 1,
    name: 'Patient History',
    component: Loadable({
      loader: () => import('./Forms/PatientHistory'),
      loading: Loading,
    }),
    prop: 'corPatientHistory',
    prefixProp: 'corPatientHistoryEntity',
  },
  {
    id: 2,
    name: 'Vision and Refraction',
    component: Loadable({
      loader: () => import('./Forms/VisionRefraction'),
      loading: Loading,
    }),
    prop: 'corVisionRefraction',
    prefixProp: 'corVisionRefractionEntity',
  },
  {
    id: 3,
    name: 'Preliminary Assessment',
    component: Loadable({
      loader: () => import('./Forms/PreliminaryAssessment'),
      loading: Loading,
    }),
    prop: 'corPreliminaryAssessment',
    prefixProp: 'corPreliminaryAssessmentEntity',
  },
  {
    id: 4,
    name: 'Anterior Eye Examination',
    component: Loadable({
      loader: () => import('./Forms/AnteriorEyeExamination'),
      loading: Loading,
    }),
    prop: 'corAnteriorEyeExamination',
    prefixProp: 'corAnteriorEyeExaminationEntity',
  },
  {
    id: 5,
    name: 'Posterior Eye Examination',
    component: Loadable({
      loader: () => import('./Forms/PosteriorEyeExamination'),
      loading: Loading,
    }),
    prop: 'corPosteriorEyeExamination',
    prefixProp: 'corPosteriorEyeExaminationEntity',
  },
  {
    id: 6,
    name: 'Management',
    component: Loadable({
      loader: () => import('./Forms/Management'),
      loading: Loading,
    }),
    prop: 'corManagement',
    prefixProp: 'corManagementEntity',
  },
  {
    id: 7,
    name: 'Contact Lens Fitting',
    component: Loadable({
      loader: () => import('./Forms/ContactLensFitting'),
      loading: Loading,
    }),
    prop: 'corContactLensFitting',
    prefixProp: 'corContactLensFittingEntity',
  },
  {
    id: 8,
    name: 'Binocular Vision',
    component: Loadable({
      loader: () => import('./Forms/BinocularVision'),
      loading: Loading,
    }),
    prop: 'corBinocularVision',
    prefixProp: 'corBinocularVisionEntity',
  },
  {
    id: 9,
    name: 'Paediatric',
    component: Loadable({
      loader: () => import('./Forms/Paediatric'),
      loading: Loading,
    }),
    prop: 'corPaediatric',
    prefixProp: 'corPaediatricEntity',
  },
  {
    id: 10,
    name: 'Investigative Tests',
    component: Loadable({
      loader: () => import('./Forms/InvestigativeTests'),
      loading: Loading,
    }),
    prop: 'corInvestigativeTests',
    prefixProp: 'corInvestigativeTestsEntity',
  },
  {
    id: 11,
    name: 'Follow-Up',
    component: Loadable({
      loader: () => import('./Forms/FollowUp'),
      loading: Loading,
    }),
    prop: 'corFollowUp',
    prefixProp: 'corFollowUpEntity',
  },
]
