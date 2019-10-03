import * as service from '@/services/common'

const url = '/api/InvoiceClaim'
const countUrl = '/api/InvoiceClaim/Count'

module.exports = {
  // remove: (params) => service.remove(url, params),
  queryById: (params) => service.query(url, params),
  queryList: (params) => service.queryList(url, params),
  upsert: (params) => service.upsert(url, params),
  queryBadgeCount: (params) => service.query(countUrl, params),
}
