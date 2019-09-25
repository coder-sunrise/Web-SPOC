import * as commonServices from '@/services/common'
import { axiosRequest } from '@/utils/request'

const queueAPIUrl = '/api/queue'
const bizSessionAPIURL = '/api/bizsession'

export const startSession = async () => {
  const response = await axiosRequest('/api/bizsession/', { method: 'POST' })
  return response
}

export const endSession = async (sessionID) => {
  const response = await axiosRequest(`/api/bizsession/${sessionID}`, {
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
