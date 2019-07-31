import request, { axiosRequest } from '@/utils/request'

export async function fetchPatientInfoByPatientID (patientID) {
  // const entities = await request(`/api/fake_patientInfo?patientID=${patientID}`)
  const response = await request(`/api/patient/${patientID}`, {
    method: 'GET',
  })
  return response
}

export async function registerVisit (visitInfo) {
  const formData = new FormData()
  formData.append('queueDetailsModel', JSON.stringify(visitInfo))
  const options = { method: 'POST', data: formData }
  console.log({ formData, stringify: JSON.stringify(visitInfo) })
  const response = await axiosRequest(`/api/queue`, options)
  console.log({ registerVisit: response })
  return {}
}
