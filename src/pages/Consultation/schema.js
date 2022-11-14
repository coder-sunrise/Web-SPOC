import Yup from '@/utils/yup'
import { hasValue } from '../Widgets/PatientHistory/config'
const schema = Yup.object().shape({
  corDiagnosis: Yup.array().of(
    Yup.object().shape({
      validityDays: Yup.number()
        .min(0, 'Number must be greater than 0')
        .nullable(true),
    }),
  ),
})

export default schema
