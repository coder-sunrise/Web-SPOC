import request from '@/utils/request'
import * as commonService from '@/services/common'

const url = '/api/doctorblock'

export const upsert = (params) => commonService.upsert(url, params)
export const query = (params) => commonService.query(url, { ...params })
export const getList = (params) => commonService.queryList(url, params)
export const getAllList = (params) => commonService.queryAll(url, params)
export const remove = (params) =>
  request(`${url}/${params.id}/false`, { method: 'DELETE' })
export const insert = (params) => request(url, { method: 'POST', body: params })
export const save = (params) => request(url, { method: 'PUT', body: params })
