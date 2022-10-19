import * as Yup from 'yup'
import { VISIT_TYPE } from '@/utils/constants'
// Form field
import FormField from './formField'
import { hasValue } from '@/pages/Widgets/PatientHistory/config'

const VitalSignMessage = {
  [FormField['visit.visit.queueNo']]: 'Queue No cannot be blank',
  [FormField['vitalsign.temperatureC']]:
    'Temperature must be between 0 and 200 °C',
  [FormField['vitalsign.bpSysMMHG']]:
    'Blood pressure must be between 0 and 999',
  [FormField['vitalsign.bpDiaMMHG']]:
    'Blood pressure must be between 0 and 999',
  [FormField['vitalsign.pulseRateBPM']]: 'Pulse must be between 0 and 999',
  [FormField['vitalsign.weightKG']]: 'Weight must be between 0 and 999.9',
  [FormField['vitalsign.saO2']]: 'SaO2 must be between 0 and 100%',
  [FormField['vitalsign.heightCM']]: 'Height must be between 0 and 999',
  [FormField['vitalsign.bodyFatPercentage']]:
    'Body fat percentage must be between 0 and 100%',
  [FormField['vitalsign.degreeOfObesity']]:
    'Degree of obesity must be between 0 and 100%',
  [FormField['vitalsign.headCircumference']]:
    'Head circumference must be between 0 and 99.9CM',
  [FormField['vitalsign.chestCircumference']]:
    'Chest circumference must be between 0 and 999.9',
  [FormField['vitalsign.waistCircumference']]:
    'Waist circumference must be between 0 and 999.9',
}

export const reportingDoctorSchema = Yup.object().shape({
  doctorProfileFK: Yup.number().required(),
})

export const visitBasicExaminationsSchema = Yup.object().shape({
  [FormField['vitalsign.temperatureC']]: Yup.number()
    .transform(value =>
      value === null || Number.isNaN(value) ? undefined : value,
    )
    .min(0, VitalSignMessage[FormField['vitalsign.temperatureC']])
    .max(200, VitalSignMessage[FormField['vitalsign.temperatureC']]),
  [FormField['vitalsign.bpSysMMHG']]: Yup.number()
    .transform(value =>
      value === null || Number.isNaN(value) ? undefined : value,
    )
    .min(0, VitalSignMessage[FormField['vitalsign.bpSysMMHG']])
    .max(999, VitalSignMessage[FormField['vitalsign.bpSysMMHG']]),
  [FormField['vitalsign.bpDiaMMHG']]: Yup.number()
    .transform(value =>
      value === null || Number.isNaN(value) ? undefined : value,
    )
    .min(0, VitalSignMessage[FormField['vitalsign.bpDiaMMHG']])
    .max(999, VitalSignMessage[FormField['vitalsign.bpDiaMMHG']]),
  [FormField['vitalsign.pulseRateBPM']]: Yup.number()
    .transform(value =>
      value === null || Number.isNaN(value) ? undefined : value,
    )
    .min(0, VitalSignMessage[FormField['vitalsign.pulseRateBPM']])
    .max(999, VitalSignMessage[FormField['vitalsign.pulseRateBPM']]),
  [FormField['vitalsign.saO2']]: Yup.number()
    .transform(value =>
      value === null || Number.isNaN(value) ? undefined : value,
    )
    .min(0, VitalSignMessage[FormField['vitalsign.saO2']])
    .max(100, VitalSignMessage[FormField['vitalsign.saO2']]),
  [FormField['vitalsign.weightKG']]: Yup.number()
    .transform(value =>
      value === null || Number.isNaN(value) ? undefined : value,
    )
    .min(0, VitalSignMessage[FormField['vitalsign.weightKG']])
    .max(999.9, VitalSignMessage[FormField['vitalsign.weightKG']]),
  [FormField['vitalsign.heightCM']]: Yup.number()
    .transform(value =>
      value === null || Number.isNaN(value) ? undefined : value,
    )
    .min(0, VitalSignMessage[FormField['vitalsign.heightCM']])
    .max(999.9, VitalSignMessage[FormField['vitalsign.heightCM']]),
  [FormField['vitalsign.bodyFatPercentage']]: Yup.number()
    .transform(value =>
      value === null || Number.isNaN(value) ? undefined : value,
    )
    .min(0, VitalSignMessage[FormField['vitalsign.bodyFatPercentage']])
    .max(100, VitalSignMessage[FormField['vitalsign.bodyFatPercentage']]),
  [FormField['vitalsign.degreeOfObesity']]: Yup.number()
    .transform(value =>
      value === null || Number.isNaN(value) ? undefined : value,
    )
    .min(0, VitalSignMessage[FormField['vitalsign.degreeOfObesity']])
    .max(100, VitalSignMessage[FormField['vitalsign.degreeOfObesity']]),
  [FormField['vitalsign.headCircumference']]: Yup.number()
    .transform(value =>
      value === null || Number.isNaN(value) ? undefined : value,
    )
    .min(0, VitalSignMessage[FormField['vitalsign.headCircumference']])
    .max(99.9, VitalSignMessage[FormField['vitalsign.headCircumference']]),
  [FormField['vitalsign.chestCircumference']]: Yup.number()
    .transform(value =>
      value === null || Number.isNaN(value) ? undefined : value,
    )
    .min(0, VitalSignMessage[FormField['vitalsign.chestCircumference']])
    .max(999.9, VitalSignMessage[FormField['vitalsign.chestCircumference']]),
  [FormField['vitalsign.waistCircumference']]: Yup.number()
    .transform(value =>
      value === null || Number.isNaN(value) ? undefined : value,
    )
    .min(0, VitalSignMessage[FormField['vitalsign.waistCircumference']])
    .max(999.9, VitalSignMessage[FormField['vitalsign.waistCircumference']]),
})

export const eyeExaminationsSchema = Yup.object().shape({
  visionCorrectionMethod: Yup.string().when(
    [
      'rightCorrectedVision5',
      'rightCorrectedVision50',
      'leftCorrectedVision5',
      'leftCorrectedVision50',
    ],
    (
      rightCorrectedVision5,
      rightCorrectedVision50,
      leftCorrectedVision5,
      leftCorrectedVision50,
    ) => {
      if (
        hasValue(rightCorrectedVision5) ||
        hasValue(rightCorrectedVision50) ||
        hasValue(leftCorrectedVision5) ||
        hasValue(leftCorrectedVision50)
      )
        return Yup.string().required()
    },
  ),
})

const schemaVisit = {
  [FormField['visit.queueNo']]: Yup.string().required(
    VitalSignMessage[FormField['visit.queueNo']],
  ),
  [FormField['visit.doctorProfileFk']]: Yup.string().required(
    'Must select an assigned doctor',
  ),
  [FormField['visit.salesType']]: Yup.number().required(
    'Must select a sales type',
  ),
  referralSourceFK: Yup.number().when('referredBy', {
    is: val => val === 'Company',
    then: Yup.number().required(),
  }),
  referralPatientProfileFK: Yup.number().when('referredBy', {
    is: val => val === 'Patient',
    then: Yup.number().required(),
  }),
  visitDoctor: Yup.array()
    .compact(v => v.isDeleted)
    .of(reportingDoctorSchema),
  visitBasicExaminations: Yup.array()
    .compact(v => v.isDeleted)
    .of(visitBasicExaminationsSchema),
}

const schemaSalesPerson = {
  [FormField['visit.salesPersonUserFK']]: Yup.string().required(
    'Must select a sales person',
  ),
}

export const VisitValidationSchema = props => {
  const { clinicSettings } = props
  const { settings } = clinicSettings

  let schema = {
    ...schemaVisit,
  }

  if (settings.isSalesPersonMandatoryInVisit)
    schema = Object.assign(schema, { ...schemaSalesPerson })

  return Yup.object().shape({
    ...schema,
  })
}
