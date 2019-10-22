import request from '@/utils/request'
import * as commonService from '@/services/common'

const url = '/api/billing'

export const query = (payload) => commonService.query(url, payload)

export const upsert = (payload) => {
  const { invoice } = payload
  return request(`${url}/save/${invoice.id}`, { method: 'POST', body: payload })
}

export const queryList = (params) =>
  commonService.queryList(url, {
    pagesize: 9999,
    ...params,
    // isCancelled: false,
  })
