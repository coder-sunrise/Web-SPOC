import * as service from '@/services/common'

const url = '/api/invoice'

module.exports = {
  queryList: (params) => service.queryList(url, params),
  query: (params) => service.query(url, params),
  queryOne: (params) => service.query(url, params),
}
