import Yup from '@/utils/yup'
import {
  visitBasicExaminationsSchema,
  eyeExaminationsSchema,
} from '@/pages/Reception/Queue/NewVisit/validationScheme'
import { hasValue } from '../Widgets/PatientHistory/config'
const schema = Yup.object().shape({
  corPatientNoteVitalSign: Yup.array()
    .compact(v => v.isDeleted)
    .of(visitBasicExaminationsSchema),
  corEyeExaminations: Yup.array()
    .compact(v => v.isDeleted)
    .of(eyeExaminationsSchema),
  corDiagnosis: Yup.array().of(
    Yup.object().shape({
      validityDays: Yup.number()
        .min(0, 'Number must be greater than 0')
        .nullable(true),
    }),
  ),
})

export default schema
