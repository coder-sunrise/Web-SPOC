import { stringify } from 'qs'
import request, { axiosRequest } from '@/utils/request'

export async function fetchPatientList () {
  console.log('fetchPatientlist')
  const response = await axiosRequest('/api/patient', { method: 'GET' })
  return response
}

export async function fetchPatientListByName (patientName) {
  console.log('fetchPatientlistbyname')
  const criteria = [
    { prop: 'name', val: patientName, opr: 'like' },
  ]
  const response = await request('/api/patient', {
    method: 'GET',
    data: stringify({ criteria }),
  })
  console.log('fetchPatientlistbyname response', response)
  return response
}

export async function fetchPatientInfoByPatientID (patientID) {
  // const entities = await request(`/api/fake_patientInfo?patientID=${patientID}`)
  const response = await request(`/api/patient/${patientID}`, {
    method: 'GET',
  })
  return response
}
