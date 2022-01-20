import Yup from '@/utils/yup'
import { visitBasicExaminationsSchema } from '@/pages/Reception/Queue/NewVisit/validationScheme'
import { inputValue } from '../Widgets/PatientHistory/config'

const eyeExaminationsMessage = {
  leftBareEye5: 'Left eye 5 meters (Bare Eye) must be between 0 and 2',
  leftCorrectedVision5:
    'Left eye 50 meters (Corrected Vision) must be between 0 and 2',
  leftBareEye50: 'Left eye 50 meters (Bare Eye) must be between 0 and 2',
  leftCorrectedVision50:
    'Left eye 50 meters (Corrected Vision) must be between 0 and 2',
  rightBareEye5: 'Right eye 5 meters (Bare Eye) must be between 0 and 2',
  rightCorrectedVision5:
    'Right eye 5 meters (Corrected Vision) must be between 0 and 2',
  rightBareEye50: 'Right eye 50 meters (Bare Eye) must be between 0 and 2',
  rightCorrectedVision50:
    'Right eye 50 meters (Corrected Vision) must be between 0 and 2',
  leftFirstResult: 'Left first result must be between 0 and 40 mmHg',
  leftSecondResult: 'Left second result must be between 0 and 40 mmHg',
  leftThirdResult: 'Left third result must be between 0 and 40 mmHg',
  rightFirstResult: 'Right first result must be between 0 and 40 mmHg',
  rightSecondResult: 'Right second result must be between 0 and 40 mmHg',
  rightThirdResult: 'Right third result must be between 0 and 40 mmHg',
}

const audiometryTestMessage = {
  leftResult1000Hz: 'Left 1000Hz result (dB) must be between 10 and 80 dB',
  leftResult4000Hz: 'Left 4000Hz result (dB) must be between 10 and 80 dB',
  rightResult1000Hz: 'Right 1000Hz result (dB) must be between 10 and 80 dB',
  rightResult4000Hz: 'Right 4000Hz result (dB) must be between 10 and 80 dB',
}

export const eyeExaminationsSchema = Yup.object().shape({
  leftBareEye5: Yup.number()
    .transform(value =>
      value === null || Number.isNaN(value) ? undefined : value,
    )
    .min(0, eyeExaminationsMessage['leftBareEye5'])
    .max(2, eyeExaminationsMessage['leftBareEye5']),
  leftCorrectedVision5: Yup.number()
    .transform(value =>
      value === null || Number.isNaN(value) ? undefined : value,
    )
    .min(0, eyeExaminationsMessage['leftCorrectedVision5'])
    .max(2, eyeExaminationsMessage['leftCorrectedVision5']),
  leftBareEye50: Yup.number()
    .transform(value =>
      value === null || Number.isNaN(value) ? undefined : value,
    )
    .min(0, eyeExaminationsMessage['leftBareEye50'])
    .max(2, eyeExaminationsMessage['leftBareEye50']),
  leftCorrectedVision50: Yup.number()
    .transform(value =>
      value === null || Number.isNaN(value) ? undefined : value,
    )
    .min(0, eyeExaminationsMessage['leftCorrectedVision50'])
    .max(2, eyeExaminationsMessage['leftCorrectedVision50']),
  rightBareEye5: Yup.number()
    .transform(value =>
      value === null || Number.isNaN(value) ? undefined : value,
    )
    .min(0, eyeExaminationsMessage['rightBareEye5'])
    .max(2, eyeExaminationsMessage['rightBareEye5']),
  rightCorrectedVision5: Yup.number()
    .transform(value =>
      value === null || Number.isNaN(value) ? undefined : value,
    )
    .min(0, eyeExaminationsMessage['rightCorrectedVision5'])
    .max(2, eyeExaminationsMessage['rightCorrectedVision5']),
  rightBareEye50: Yup.number()
    .transform(value =>
      value === null || Number.isNaN(value) ? undefined : value,
    )
    .min(0, eyeExaminationsMessage['rightBareEye50'])
    .max(2, eyeExaminationsMessage['rightBareEye50']),
  rightCorrectedVision50: Yup.number()
    .transform(value =>
      value === null || Number.isNaN(value) ? undefined : value,
    )
    .min(0, eyeExaminationsMessage['rightCorrectedVision50'])
    .max(2, eyeExaminationsMessage['rightCorrectedVision50']),
  leftFirstResult: Yup.number()
    .transform(value =>
      value === null || Number.isNaN(value) ? undefined : value,
    )
    .min(0, eyeExaminationsMessage['leftFirstResult'])
    .max(40, eyeExaminationsMessage['leftFirstResult']),
  leftSecondResult: Yup.number()
    .transform(value =>
      value === null || Number.isNaN(value) ? undefined : value,
    )
    .min(0, eyeExaminationsMessage['leftSecondResult'])
    .max(40, eyeExaminationsMessage['leftSecondResult']),
  leftThirdResult: Yup.number()
    .transform(value =>
      value === null || Number.isNaN(value) ? undefined : value,
    )
    .min(0, eyeExaminationsMessage['leftThirdResult'])
    .max(40, eyeExaminationsMessage['leftThirdResult']),
  rightFirstResult: Yup.number()
    .transform(value =>
      value === null || Number.isNaN(value) ? undefined : value,
    )
    .min(0, eyeExaminationsMessage['rightFirstResult'])
    .max(40, eyeExaminationsMessage['rightFirstResult']),
  rightSecondResult: Yup.number()
    .transform(value =>
      value === null || Number.isNaN(value) ? undefined : value,
    )
    .min(0, eyeExaminationsMessage['rightSecondResult'])
    .max(40, eyeExaminationsMessage['rightSecondResult']),
  rightThirdResult: Yup.number()
    .transform(value =>
      value === null || Number.isNaN(value) ? undefined : value,
    )
    .min(0, eyeExaminationsMessage['rightThirdResult'])
    .max(40, eyeExaminationsMessage['rightThirdResult']),
  visionCorrectionMethod: Yup.string().when(
    [
      'leftBareEye5',
      'leftCorrectedVision5',
      'rightBareEye5',
      'rightCorrectedVision5',
    ],
    (
      leftBareEye5,
      leftCorrectedVision5,
      rightBareEye5,
      rightCorrectedVision5,
    ) => {
      if (
        inputValue(leftBareEye5) ||
        inputValue(leftCorrectedVision5) ||
        inputValue(rightBareEye5) ||
        inputValue(rightCorrectedVision5)
      ) {
        return Yup.string().required()
      }
    },
  ),
})

export const audiometryTestSchema = Yup.object().shape({
  leftResult1000Hz: Yup.number()
    .transform(value =>
      value === null || Number.isNaN(value) ? undefined : value,
    )
    .min(10, audiometryTestMessage['leftResult1000Hz'])
    .max(80, audiometryTestMessage['leftResult1000Hz']),
  leftResult4000Hz: Yup.number()
    .transform(value =>
      value === null || Number.isNaN(value) ? undefined : value,
    )
    .min(10, audiometryTestMessage['leftResult4000Hz'])
    .max(80, audiometryTestMessage['leftResult4000Hz']),
  rightResult1000Hz: Yup.number()
    .transform(value =>
      value === null || Number.isNaN(value) ? undefined : value,
    )
    .min(10, audiometryTestMessage['rightResult1000Hz'])
    .max(80, audiometryTestMessage['rightResult1000Hz']),
  rightResult4000Hz: Yup.number()
    .transform(value =>
      value === null || Number.isNaN(value) ? undefined : value,
    )
    .min(10, audiometryTestMessage['rightResult4000Hz'])
    .max(80, audiometryTestMessage['rightResult4000Hz']),
})

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
  corAudiometryTest: Yup.array()
    .compact(v => v.isDeleted)
    .of(audiometryTestSchema),
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
