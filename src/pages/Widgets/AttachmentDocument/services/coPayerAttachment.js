import * as service from '@/services/common'

const url = '/api/CoPayerAttachment'

export const queryList = params =>
         service.queryList(url, {
           ...params,
           sorting: [{ columnName: 'updateDate', direction: 'asc' }],
         })
export const upsert = params => service.upsert(url, params)
export const remove = params => service.remove(url, params)
