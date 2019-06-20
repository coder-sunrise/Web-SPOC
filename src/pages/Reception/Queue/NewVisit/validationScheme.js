import * as Yup from 'yup'
// Form field
import FormField from './formField'

const VitalSignMessage = {
  [FormField['visit.visit.queueNo']]: 'Queue No cannot be blank',
  [FormField['vitalsign.temperature']]:
    'Temperature must be between 0 and 200 °C',
  [FormField['vitalsign.bloodPressure']]:
    'Blood pressure must be between 0 and 999',
  [FormField['vitalsign.heartRate']]: 'Heart rate must be between 0 and 999',
  [FormField['vitalsign.weight']]: 'Weight must be between 0 and 999',
  [FormField['vitalsign.height']]: 'Height must be between 0 and 999',
}

export default Yup.object().shape({
  [FormField['visit.queueNo']]: Yup.string().required(
    VitalSignMessage[FormField['visit.queueNo']],
  ),

  [FormField['vitalsign.temperature']]: Yup.number()
    .min(0, VitalSignMessage[FormField['vitalsign.temperature']])
    .max(200, VitalSignMessage[FormField['vitalsign.temperature']]),
  [FormField['vitalsign.bloodPressure']]: Yup.number()
    .min(0, VitalSignMessage[FormField['vitalsign.bloodPressure']])
    .max(999, VitalSignMessage[FormField['vitalsign.bloodPressure']]),
  [FormField['vitalsign.heartRate']]: Yup.number()
    .min(0, VitalSignMessage[FormField['vitalsign.heartRate']])
    .max(999, VitalSignMessage[FormField['vitalsign.heartRate']]),
  [FormField['vitalsign.weight']]: Yup.number()
    .min(0, VitalSignMessage[FormField['vitalsign.weight']])
    .max(999, VitalSignMessage[FormField['vitalsign.weight']]),
  [FormField['vitalsign.height']]: Yup.number()
    .min(0, VitalSignMessage[FormField['vitalsign.height']])
    .max(999, VitalSignMessage[FormField['vitalsign.height']]),
})
