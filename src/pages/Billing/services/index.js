import request from '@/utils/request'
import * as commonService from '@/services/common'

const url = '/api/billing'

export const query = (payload) => commonService.query(url, payload)

export const save = (payload) => {
  const { visitId } = payload
  return request(`${url}/save/${visitId}`, { method: 'PUT', body: payload })
}

export const complete = (payload) => {
  const { visitId } = payload
  return request(`${url}/complete/${visitId}`, {
    method: 'PUT',
    body: payload,
  })
}

export const queryList = (params) =>
  commonService.queryList(url, {
    pagesize: 9999,
    ...params,
    // isCancelled: false,
  })
