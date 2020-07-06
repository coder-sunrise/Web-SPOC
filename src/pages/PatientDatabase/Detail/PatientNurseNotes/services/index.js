import request from '@/utils/request'
import * as commonService from '@/services/common'

const url = '/api/patientnursenotes'

export const query = (payload) => commonService.query(url, payload)

export const queryList = (params) => {
  return commonService.queryList(url, {
    pagesize: 9999,
    ...params,
  })
}
export const upsert = (params) => commonService.upsert(url, params)
