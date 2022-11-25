import Loadable from 'react-loadable'
import {
  CLINICALNOTE_FORM,
  CLINICALNOTE_FORMTHUMBNAIL,
} from '@/utils/constants'
import Loading from '@/components/PageLoading/index'
import PosteriorEyeExamination from '@/assets/img/ClinicalNoteForm/PosteriorEyeExamination.jpg'
import moment from 'moment'
import Paediatric from '@/assets/img/ClinicalNoteForm/OcularMotility.jpg'
import PupillaryAssessment from '@/assets/img/ClinicalNoteForm/PupillaryAssessment.jpg'
import Confrontation from '@/assets/img/ClinicalNoteForm/Confrontation.jpg'
import ContactLensFitting from '@/assets/img/ClinicalNoteForm/ContactLensFitting.png'

export const formConfigs = [
  {
    id: CLINICALNOTE_FORM.PATIENTHISTORY,
    name: 'Patient History',
    component: Loadable({
      loader: () => import('./Forms/PatientHistory'),
      loading: Loading,
    }),
    prop: 'corDoctorNote.corPatientHistory',
    prefixProp: 'corDoctorNote.corPatientHistoryEntity',
    defaultValue: {
      lastChangeDate: moment(),
    },
  },
  {
    id: CLINICALNOTE_FORM.VISIONREFRACTION,
    name: 'Vision and Refraction',
    component: Loadable({
      loader: () => import('./Forms/VisionRefraction'),
      loading: Loading,
    }),
    prop: 'corDoctorNote.corVisionRefraction',
    prefixProp: 'corDoctorNote.corVisionRefractionEntity',
    defaultValue: {
      unaidedVA_Distance_RE_VA: '6',
      unaidedVA_Distance_LE_VA: '6',
      objectiveRefraction_RE_VA: '6',
      objectiveRefraction_LE_VA: '6',
      subjectiveRefraction_RE_VA: '6',
      subjectiveRefraction_LE_VA: '6',
    },
  },
  {
    id: CLINICALNOTE_FORM.PRELIMINARYASSESSMENT,
    name: 'Preliminary Assessment',
    component: Loadable({
      loader: () => import('./Forms/PreliminaryAssessment'),
      loading: Loading,
    }),
    prop: 'corDoctorNote.corPreliminaryAssessment',
    prefixProp: 'corDoctorNote.corPreliminaryAssessmentEntity',
    defaultImage: {
      PupillaryAssessment,
      Confrontation,
    },
    cavanSize: { width: '80vw', height: 300 },
    imageSize: { width: 800, height: 120 },
    position: { left: 175, top: 50 },
    thumbnailSize: { width: 300, height: 150 },
    thumbnailDisplaySize: { width: 260, height: 130 },
    defaultValue: {
      lastChangeDate: moment(),
      // tonometryInstrumentTime: moment(),
      recordStatusFK: 1,
      pupillaryAssessmentScribbleNote: {
        thumbnail: CLINICALNOTE_FORMTHUMBNAIL.PUPILLARYASSESSMENT,
        subject: 'Pupillary Assessment',
      },
      confrontationScribbleNote: {
        thumbnail: CLINICALNOTE_FORMTHUMBNAIL.CONFRONTATION,
        subject: 'Confrontation',
      },
    },
  },
  {
    id: CLINICALNOTE_FORM.ANTERIOREYEEXAMINATION,
    name: 'Anterior Eye Examination',
    component: Loadable({
      loader: () => import('./Forms/AnteriorEyeExamination'),
      loading: Loading,
    }),
    prop: 'corDoctorNote.corAnteriorEyeExamination',
    prefixProp: 'corDoctorNote.corAnteriorEyeExaminationEntity',
    cavanSize: { width: 600, height: 300 },
    imageSize: { width: 250, height: 200 },
    position: { left: 175, top: 50 },
    thumbnailSize: { width: 300, height: 150 },
    thumbnailDisplaySize: { width: 260, height: 130 },
    defaultValue: {
      lastChangeDate: moment(),
      rightScribbleNote: {
        thumbnail: CLINICALNOTE_FORMTHUMBNAIL.POSTERIOREYEEXAMINATION,
        subject: 'Right Eye',
      },
      leftScribbleNote: {
        thumbnail: CLINICALNOTE_FORMTHUMBNAIL.POSTERIOREYEEXAMINATION,
        subject: 'Left Eye',
      },
    },
    defaultImage: PosteriorEyeExamination,
  },
  {
    id: CLINICALNOTE_FORM.POSTERIOREYEEXAMINATION,
    name: 'Posterior Eye Examination',
    component: Loadable({
      loader: () => import('./Forms/PosteriorEyeExamination'),
      loading: Loading,
    }),
    prop: 'corDoctorNote.corPosteriorEyeExamination',
    prefixProp: 'corDoctorNote.corPosteriorEyeExaminationEntity',
    cavanSize: { width: 600, height: 300 },
    imageSize: { width: 250, height: 200 },
    position: { left: 175, top: 50 },
    thumbnailSize: { width: 300, height: 150 },
    thumbnailDisplaySize: { width: 260, height: 130 },
    defaultValue: {
      lastChangeDate: moment(),
      rightScribbleNote: {
        thumbnail: CLINICALNOTE_FORMTHUMBNAIL.POSTERIOREYEEXAMINATION,
        subject: 'Right Eye',
      },
      leftScribbleNote: {
        thumbnail: CLINICALNOTE_FORMTHUMBNAIL.POSTERIOREYEEXAMINATION,
        subject: 'Left Eye',
      },
    },
    defaultImage: PosteriorEyeExamination,
  },
  {
    id: CLINICALNOTE_FORM.MANAGEMENT,
    name: 'Management',
    component: Loadable({
      loader: () => import('./Forms/Management'),
      loading: Loading,
    }),
    prop: 'corDoctorNote.corManagement',
    prefixProp: 'corDoctorNote.corManagementEntity',
    defaultValue: {
      lastChangeDate: moment(),
    },
  },
  {
    id: CLINICALNOTE_FORM.CONTACTLENSFITTING,
    name: 'Contact Lens Fitting',
    component: Loadable({
      loader: () => import('./Forms/ContactLensFitting'),
      loading: Loading,
    }),
    prop: 'corDoctorNote.corContactLensFitting',
    prefixProp: 'corDoctorNote.corContactLensFittingEntity',
    cavanSize: { width: 600, height: 300 },
    imageSize: { width: 250, height: 200 },
    position: { left: 175, top: 50 },
    thumbnailSize: { width: 300, height: 150 },
    thumbnailDisplaySize: { width: 260, height: 130 },
    defaultValue: {
      lastChangeDate: moment(),
      rightScribbleNote: {
        thumbnail: CLINICALNOTE_FORMTHUMBNAIL.CONTACTLENSFITTING,
        subject: 'Right Eye',
      },
      leftScribbleNote: {
        thumbnail: CLINICALNOTE_FORMTHUMBNAIL.CONTACTLENSFITTING,
        subject: 'Left Eye',
      },
    },
    defaultImage: ContactLensFitting,
  },
  {
    id: CLINICALNOTE_FORM.BINOCULARVISION,
    name: 'Binocular Vision',
    component: Loadable({
      loader: () => import('./Forms/BinocularVision'),
      loading: Loading,
    }),
    prop: 'corDoctorNote.corBinocularVision',
    prefixProp: 'corDoctorNote.corBinocularVisionEntity',
    defaultImage: Paediatric,
    cavanSize: { width: 600, height: 300 },
    imageSize: { width: 250, height: 200 },
    position: { left: 175, top: 50 },
    thumbnailSize: { width: 300, height: 150 },
    thumbnailDisplaySize: { width: 260, height: 130 },
    defaultValue: {
      lastUpdateDate: moment(),
      recordStatusFK: 1,
      ocularMotilityScribbleNote: {
        thumbnail: CLINICALNOTE_FORMTHUMBNAIL.PAEDIATRIC,
        subject: 'Ocular Motility',
      },
    },
  },
  {
    id: CLINICALNOTE_FORM.PAEDIATRIC,
    name: 'Paediatric',
    component: Loadable({
      loader: () => import('./Forms/Paediatric'),
      loading: Loading,
    }),
    prop: 'corDoctorNote.corPaediatric',
    prefixProp: 'corDoctorNote.corPaediatricEntity',
    defaultImage: Paediatric,
    cavanSize: { width: 600, height: 300 },
    imageSize: { width: 250, height: 200 },
    position: { left: 175, top: 50 },
    thumbnailSize: { width: 300, height: 150 },
    thumbnailDisplaySize: { width: 260, height: 130 },
    defaultValue: {
      lastChangeDate: moment(),
      recordStatusFK: 1,
      ocularMotilityScribbleNote: {
        thumbnail: CLINICALNOTE_FORMTHUMBNAIL.PAEDIATRIC,
        subject: 'Ocular Motility',
      },
    },
  },
  {
    id: CLINICALNOTE_FORM.INVESTIGATIVETESTS,
    name: 'Investigative Tests',
    component: Loadable({
      loader: () => import('./Forms/InvestigativeTests'),
      loading: Loading,
    }),
    prop: 'corDoctorNote.corInvestigativeTests',
    prefixProp: 'corDoctorNote.corInvestigativeTestsEntity',
    defaultValue: {
      lastChangeDate: moment(),
    },
  },
  {
    id: CLINICALNOTE_FORM.FOLLOWUP,
    name: 'Follow-up',
    component: Loadable({
      loader: () => import('./Forms/FollowUp'),
      loading: Loading,
    }),
    prop: 'corDoctorNote.corFollowUp',
    prefixProp: 'corDoctorNote.corFollowUpEntity',
    defaultValue: {
      lastChangeDate: moment(),
      aided_RE_VA: '6',
      aided_LE_VA: '6',
      unaided_RE_VA: '6',
      unaided_LE_VA: '6',
    },
  },
]
