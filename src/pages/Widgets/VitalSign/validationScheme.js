import * as Yup from 'yup'

const VitalSignMessage = {
  temperatureC: 'Temperature must be between 0 and 200 °C',
  bpSysMMHG: 'Blood pressure must be between 0 and 999',
  bpDiaMMHG: 'Blood pressure must be between 0 and 999',
  pulseRateBPM: 'Heart rate must be between 0 and 999',
  weightKG: 'Weight must be between 0 and 999.9',
  heightCM: 'Height must be between 0 and 999',
}

export default Yup.object().shape({
  patientVitalSign: Yup.array().of(
    Yup.object().shape({
      temperatureC: Yup.number()
        .min(0, VitalSignMessage.temperatureC)
        .max(200, VitalSignMessage.temperatureC),
      bpSysMMHG: Yup.number()
        .min(0, VitalSignMessage.bpSysMMHG)
        .max(999, VitalSignMessage.bpSysMMHG),
      bpDiaMMHG: Yup.number()
        .min(0, VitalSignMessage.bpDiaMMHG)
        .max(999, VitalSignMessage.bpDiaMMHG),
      pulseRateBPM: Yup.number()
        .min(0, VitalSignMessage.pulseRateBPM)
        .max(999, VitalSignMessage.pulseRateBPM),
      weightKG: Yup.number()
        .min(0, VitalSignMessage.weightKG)
        .max(999.9, VitalSignMessage.weightKG),
      heightCM: Yup.number()
        .min(0, VitalSignMessage.heightCM)
        .max(999, VitalSignMessage.heightCM),
    }),
  ),
})
