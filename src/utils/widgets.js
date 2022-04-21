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
    name:
      clinicTypeFK !== CLINIC_TYPE.DENTAL ? 'Clinical Notes' : 'Dental Notes',
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
        padding: '0 5px',
      },
    },
    testProps: {
      test: '123',
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
    id: '13',
    name: 'Medical History',
    accessRight: 'queue.consultation.widgets.medicalhistory',
    component: Loadable({
      loader: () => import('@/pages/Widgets/MedicalHistory'),
      loading: Loading,
    }),
    model: 'patientMedicalHistory',
    layoutConfig: {
      h: 2,
      w: 12,
      style: {
        padding: 5,
      },
    },
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
    name: 'Patient History',
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
      // render (loaded, props) {
      //   let Component = loaded.default
      //   return <Component {...props} />
      // },
    }),
    model: 'orders',
    // associatedProps: [
    //   'corOrderAdjustment',
    //   'corService',
    //   'corPrescriptionItem',
    //   'corVaccinationItem',
    // ],
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
    id: '7',
    name: 'Basic Examinations',
    shortName: 'Basic Exam.',
    accessRight: 'queue.consultation.widgets.vitalsign',
    component: Loadable({
      loader: () => import('@/pages/Widgets/VitalSign'),
      loading: Loading,
    }),
    model: 'patientVitalSign',
    associatedProps: ['corPatientNoteVitalSign'],
    layoutConfig: {
      minW: 12,
      minH: 10,
      style: {
        padding: '5px',
      },
    },
  },
  {
    id: '23',
    name: 'Eye Examinations',
    shortName: 'Eye Exam.',
    accessRight: 'queue.consultation.widgets.eyeexaminations',
    component: Loadable({
      loader: () => import('@/pages/Widgets/EyeExaminations'),
      loading: Loading,
    }),
    associatedProps: ['corEyeExaminations'],
    layoutConfig: {
      minW: 12,
      minH: 10,
      style: {
        padding: '0 5px',
      },
    },
  },
  {
    id: '24',
    name: 'Audiometry Test',
    shortName: 'Audiometry',
    accessRight: 'queue.consultation.widgets.audiometrytest',
    component: Loadable({
      loader: () => import('@/pages/Widgets/AudiometryTest'),
      loading: Loading,
    }),
    associatedProps: ['corAudiometryTest'],
    layoutConfig: {
      minW: 12,
      minH: 10,
      style: {
        padding: '5px',
      },
    },
  },
  {
    id: '21',
    name: 'Dental Chart',
    accessRight: 'queue.consultation.widgets.dentalchart',
    component: Loadable({
      loader: () => import('@/pages/Widgets/DentalChart'),
      loading: Loading,
    }),
    onUnmount: () => {
      window.g_app._store.dispatch({
        type: 'dentalChartComponent/reset',
      })
    },
  },
  {
    id: '8',
    name: 'Attachment',
    accessRight: 'queue.consultation.widgets.attachment',
    component: Loadable({
      loader: () => import('@/pages/Widgets/Attachment'),
      render: (loaded, p) => {
        let Cmpnet = loaded.default
        return <Cmpnet {...p} mainType='ClinicalNotes' />
      },
      loading: Loading,
    }),
    model: 'attachment',
    associatedProps: ['corAttachment'],
    layoutConfig: {
      minW: 12,
      minH: 10,
      style: {
        padding: '5px',
      },
    },
  },
  {
    id: '9',
    name: 'Visual Acuity Test',
    shortName: 'Visual Acuity',
    accessRight: 'queue.consultation.widgets.eyevisualacuity',
    component: Loadable({
      loader: () => import('@/pages/Widgets/EyeVisualAcuity'),
      render: (loaded, p) => {
        let Cmpnet = loaded.default
        return (
          <Fragment>
            <Authorized authority='queue.consultation.widgets.eyevisualacuity'>
              <Cmpnet
                {...p}
                prefix='corEyeVisualAcuityTest.eyeVisualAcuityTestForms'
                attachmentsFieldName='corAttachment'
                fromConsultation
                handleUpdateAttachments={({
                  updated,
                  form,
                  dispatch,
                  consultation,
                }) => {
                  form.setFieldValue('corAttachment', updated)
                  const { entity } = consultation
                  entity.corAttachment = updated
                  dispatch({
                    type: 'consultation/updateState',
                    payload: {
                      entity,
                    },
                  })
                }}
              />
            </Authorized>
          </Fragment>
        )
      },
      loading: Loading,
    }),
    associatedProps: ['corEyeVisualAcuityTest'],
    layoutConfig: {
      minW: 12,
      minH: 10,
      style: {
        padding: 5,
      },
    },
  },
  {
    id: '10',
    name: 'Refraction Form',
    accessRight: 'queue.consultation.widgets.eyerefractionform',
    component: Loadable({
      loader: () => import('@/pages/Widgets/RefractionForm'),
      render: (loaded, p) => {
        let Cmpnet = loaded.default
        return <Cmpnet {...p} prefix='corEyeRefractionForm.formData' />
      },
      loading: Loading,
    }),
    associatedProps: ['corEyeRefractionForm'],
    // model: 'refractionForm',
    layoutConfig: {},
  },
  {
    id: '11',
    name: 'Examination Form',
    shortName: 'Exam. Form',
    accessRight: 'queue.consultation.widgets.eyeexaminationform',
    component: Loadable({
      loader: () => import('@/pages/Widgets/ExaminationForm'),
      render: (loaded, p) => {
        let Cmpnet = loaded.default
        return <Cmpnet {...p} prefix='corEyeExaminationForm.formData' />
      },
      loading: Loading,
    }),
    associatedProps: ['corEyeExaminationForm'],
    // model: 'refractionForm',
    layoutConfig: {},
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
