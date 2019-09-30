import * as service from '@/services/common'
import request from '@/utils/request'

const url = '/api/PurchaseOrder'
const runningNumberUrl = '/api/runningNumber'

module.exports = {
  queryList: (params) => service.queryList(url, params),
  upsert: (params) => service.upsert(url, params),
  queryById: (params) => service.query(url, params),
  queryRunningNumber: (params) =>
    service.query(`${runningNumberUrl}/${params.prefix}`, params),
  upsertWithStatusCode: async (params) => {
    let r
    if (params.id && params.purchaseOrderStatusCode) {
      r = await request(
        `${url}/${params.id}/${params.purchaseOrderStatusCode}`,
        {
          method: 'PUT',
          body: params,
        },
      )
    }
    return r
  },
}
