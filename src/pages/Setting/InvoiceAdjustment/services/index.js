import * as service from '@/services/common'

const url = '/api/ctinvoiceadjustment'

module.exports = {
  query: (params) => service.query(url, params),
  queryList: (params) => service.queryList(url, params),
  upsert: (params) => service.upsert(url, params),
}
