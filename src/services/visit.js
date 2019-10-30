import request, { axiosRequest } from '@/utils/request'
import * as service from '@/services/common'

const patientApiUrl = '/api/patient'
const queueApiUrl = '/api/queue'

// export async function fetchPatientInfoByPatientID (patientID) {
//   // const entities = await request(`/api/fake_patientInfo?patientID=${patientID}`)
//   const response = await request(`/api/patient/${patientID}`, {
//     method: 'GET',
//   })
//   return response
// }

export const query = (payload) => {
  if (payload.id === 0) return false
  return service.query(queueApiUrl, payload)
}

export async function registerVisit (visitInfo) {
  const options = {
    method: 'POST',
    data: JSON.stringify(visitInfo),
  }
  const response = await axiosRequest(`/api/queue`, options)

  return response
}

export const saveVisit = async (visitInfo) => {
  const { id } = visitInfo
  const options = {
    method: 'PUT',
    data: JSON.stringify(visitInfo),
  }

  const response = await axiosRequest(`/api/queue/${id}`, options)
  return response
}

export const upsert = (payload) => service.upsert(queueApiUrl, payload)
