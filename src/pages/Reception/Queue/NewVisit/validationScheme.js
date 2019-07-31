import * as Yup from 'yup'
// Form field
import FormField from './formField'

const VitalSignMessage = {
  [FormField['visit.visit.queueNo']]: 'Queue No cannot be blank',
  [FormField['vitalsign.temperatureC']]:
    'Temperature must be between 0 and 200 °C',
  [FormField['vitalsign.bpSysMMHG']]:
    'Blood pressure must be between 0 and 999',
  [FormField['vitalsign.bpDiaMMHG']]:
    'Blood pressure must be between 0 and 999',
  [FormField['vitalsign.pulseRateBPM']]: 'Heart rate must be between 0 and 999',
  [FormField['vitalsign.weightKG']]: 'Weight must be between 0 and 999',
  [FormField['vitalsign.heightCM']]: 'Height must be between 0 and 999',
}

export default Yup.object().shape({
  [FormField['visit.queueNo']]: Yup.string().required(
    VitalSignMessage[FormField['visit.queueNo']],
  ),
  [FormField['visit.doctorProfileFk']]: Yup.string().required(
    'Must select an assigned doctor',
  ),
  [FormField['vitalsign.temperatureC']]: Yup.number()
    .min(0, VitalSignMessage[FormField['vitalsign.temperatureC']])
    .max(200, VitalSignMessage[FormField['vitalsign.temperatureC']]),
  [FormField['vitalsign.bpSysMMHG']]: Yup.number()
    .min(0, VitalSignMessage[FormField['vitalsign.bpSysMMHG']])
    .max(999, VitalSignMessage[FormField['vitalsign.bpSysMMHG']]),
  [FormField['vitalsign.bpDiaMMHG']]: Yup.number()
    .min(0, VitalSignMessage[FormField['vitalsign.bpDiaMMHG']])
    .max(999, VitalSignMessage[FormField['vitalsign.bpDiaMMHG']]),
  [FormField['vitalsign.pulseRateBPM']]: Yup.number()
    .min(0, VitalSignMessage[FormField['vitalsign.pulseRateBPM']])
    .max(999, VitalSignMessage[FormField['vitalsign.pulseRateBPM']]),
  [FormField['vitalsign.weightKG']]: Yup.number()
    .min(0, VitalSignMessage[FormField['vitalsign.weightKG']])
    .max(999, VitalSignMessage[FormField['vitalsign.weightKG']]),
  [FormField['vitalsign.heightCM']]: Yup.number()
    .min(0, VitalSignMessage[FormField['vitalsign.heightCM']])
    .max(999, VitalSignMessage[FormField['vitalsign.heightCM']]),
})
