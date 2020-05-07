import * as service from '@/services/common'

// const url = '/api/userprofileABC123'
const url = '/api/systemmessage'

export const query = (params) => service.query(url, params)
export const queryList = (params) => service.queryList(`${url}/user`, params)
export const upsertRead = (params) => {
  return service.upsert(`${url}/read`, params)
}
export const upsertDismiss = (params) => {
  return service.upsert(`${url}/dismiss`, params)
}
