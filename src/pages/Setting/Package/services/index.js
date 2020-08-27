import * as service from '@/services/common'

const url = '/api/Package'

module.exports = {
  query: (params) => service.query(url, params),
  queryList: (params) => service.queryList(url, params),
  upsert: (params) => service.upsert(url, params),
}
