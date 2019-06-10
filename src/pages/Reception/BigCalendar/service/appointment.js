import { stringify } from 'qs'
import request, { axiosRequest } from '@/utils/request'

export async function fetchPatientListByName (patientName) {
  const criteria = [
    { prop: 'name', val: patientName, opr: 'like' },
  ]
  const response = await request('/api/patient', {
    method: 'GET',
    data: stringify({ criteria }),
  })

  return response
}

export async function fetchPatientInfoByPatientID (patientID) {
  // const entities = await request(`/api/fake_patientInfo?patientID=${patientID}`)
  const response = await request(`/api/patient/${patientID}`, {
    method: 'GET',
  })
  return response
}
