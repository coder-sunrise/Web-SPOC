import Yup from '@/utils/yup'
import { visitBasicExaminationsSchema } from '@/pages/Reception/Queue/NewVisit/validationScheme'
import { hasValue } from '../Widgets/PatientHistory/config'
const schema = Yup.object().shape({
  // corPrescriptionItem: Yup.array().of(
  //   Yup.object().shape({
  //     // Description: Yup.string().required('Description is required'),
  //     // UnitPrice: Yup.number().required('Unit Price is required'),
  //     corPrescriptionItemPrecaution: Yup.array().of(
  //       Yup.object().shape(
  //         {
  //           // prescriptionItemFK:
  //         },
  //       ),
  //     ),
  //   }),
  // ),
  corPatientNoteVitalSign: Yup.array()
    .compact(v => v.isDeleted)
    .of(visitBasicExaminationsSchema),
  corDiagnosis: Yup.array().of(
    Yup.object().shape({
      validityDays: Yup.number()
        .min(0, 'Number must be greater than 0')
        .nullable(true),
    }),
  ),

  // corDiagnosis: Yup.array().of(
  //   Yup.object().shape({
  //     diagnosisFK: Yup.number().required(),
  //     // complication: Yup.array().of(Yup.string()).required().min(1),
  //     onsetDate: Yup.string().required(),
  //   }),
  // ),

  // corEyeVisualAcuityTest: Yup.object().shape({
  //   eyeVisualAcuityTestForms: Yup.array().of(
  //     Yup.object().shape({
  //       nearVADsOD: Yup.string().required(),
  //     }),
  //   ),
  // }),
})

export default schema
