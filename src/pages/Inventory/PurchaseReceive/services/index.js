import * as service from '@/services/common'

const url = '/api/PurchaseOrder'

module.exports = {
  queryList: (params) => service.queryList(url, params),
  upsert: (params) => service.upsert(url, params),
  queryById: (params) => service.query(url, params),
}
