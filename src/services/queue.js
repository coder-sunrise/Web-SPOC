import * as commonServices from '@/services/common'
import request, { axiosRequest } from '@/utils/request'

const queueAPIUrl = '/api/queue'
const bizSessionAPIURL = '/api/bizsession'
const appointmentAPIURL = '/api/Appointment/PatientAppointmentListing'

export const startSession = async () => {
  const response = await request('/api/bizsession/', { method: 'POST' })
  return response
}

export const endSession = async (sessionID) => {
  const response = await request(`/api/bizsession/${sessionID}`, {
    method: 'PUT',
  })
  return response
}

export const getBizSession = (params) =>
  commonServices.queryList(bizSessionAPIURL, params)

export const query = (params) => commonServices.query(bizSessionAPIURL, params)

export const queryList = (params) =>
  commonServices.queryList(queueAPIUrl, params)

export const deleteQueue = (params) =>
  commonServices.remove(queueAPIUrl, params)

export const queryAppointmentListing = (params) =>
  commonServices.queryList(`${appointmentAPIURL}`, {
    ...params,
    isCancelled: false,
    pagesize: 999,
  })
