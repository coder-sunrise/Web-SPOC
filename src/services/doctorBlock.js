import request from '@/utils/request'
import * as commonService from '@/services/common'

const url = '/api/doctorblock'

export const upsert = (params) => commonService.upsert(url, params)
export const query = (params) => commonService.query(url, { ...params })
export const queryList = (params) => commonService.queryList(url, params)

export const insert = (params) => request(url, { method: 'POST', body: params })
export const save = (params) => request(url, { method: 'PUT', body: params })
