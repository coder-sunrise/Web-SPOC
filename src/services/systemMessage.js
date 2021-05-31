import * as service from '@/services/common'

const url = '/api/systemnotification'

export const query = (params) => service.query(url, params)
export const queryList = (params) => service.queryList(`${url}/user`, params)
export const upsertRead = (params) => {
  return service.upsert(`${url}/read`, params)
}
export const upsertDismiss = (params) => {
  return service.upsert(`${url}/dismiss`, params)
}
export const upsertDismissAll = (params) => {
  return service.upsert(`${url}/dismissall`, params)
}
