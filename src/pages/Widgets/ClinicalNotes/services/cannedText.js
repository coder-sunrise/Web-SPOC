import * as commonService from '@/services/common'

const url = '/api/CannedText'

export const upsert = (params) => commonService.upsert(url, params)
export const remove = (params) => commonService.remove(url, params)
