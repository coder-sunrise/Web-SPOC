import * as service from '@/services/common'

const url = '/api/PatientAttachment'

export const queryList = params =>
         service.queryList(url, {
           ...params,
           sorting: [{ columnName: 'createDate', direction: 'desc' }],
         })
export const upsert = params => service.upsert(url, params)
export const remove = params => service.remove(url, params)
