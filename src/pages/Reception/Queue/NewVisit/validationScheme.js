import * as Yup from 'yup'
import { VISIT_TYPE } from '@/utils/constants'
// Form field
import FormField from './formField'
import { hasValue } from '@/pages/Widgets/PatientHistory/config'

export const reportingDoctorSchema = Yup.object().shape({
  doctorProfileFK: Yup.number().required(),
})

const schemaVisit = {
  [FormField['visit.queueNo']]: Yup.string().required(
    'Queue No cannot be blank',
  ),
  [FormField['visit.doctorProfileFk']]: Yup.string().required(
    'Must select an optometrist',
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
