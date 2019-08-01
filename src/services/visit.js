import request, { axiosRequest } from '@/utils/request'
import * as service from '@/services/common'

const patientApiUrl = '/api/patient'

export async function fetchPatientInfoByPatientID (patientID) {
  // const entities = await request(`/api/fake_patientInfo?patientID=${patientID}`)
  const response = await request(`/api/patient/${patientID}`, {
    method: 'GET',
  })
  return response
}

export const query = (params) => service.query(patientApiUrl, params)

export async function registerVisit (visitInfo) {
  const formData = new FormData()
  formData.append('queueDetailsModel', JSON.stringify(visitInfo))
  const options = {
    method: 'POST',
    data: formData,
    contentType: 'application/x-www-form-urlencoded',
  }

  const response = await axiosRequest(`/api/queue`, options)
  console.log({ registerVisit: response })
  return response
}

export const saveVisit = async (visitInfo) => {
  const { visitID, ...restVisit } = visitInfo
  const formData = new FormData()
  formData.append('queueDetails', JSON.stringify({ queueDetails: restVisit }))
  console.log({ body: JSON.stringify({ queueDetails: restVisit }) })
  const options = {
    method: 'PUT',
    data: JSON.stringify({ queueDetails: restVisit }),
    // contentType: 'application/x-www-form-urlencoded',
  }

  const response = await axiosRequest(`/api/queue/${visitID}`, options)
  return response
}

export const fetchVisitInfo = async (visitID) => {
  const response = await axiosRequest(`/api/queue/${visitID}`)
  return response
}
