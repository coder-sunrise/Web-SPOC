import * as service from '@/services/common'

const url = '/api/ctroom'

module.exports = {
  // remove: (params) => service.remove(url, params),
  // query: (params) => service.query(url, params),
  queryList: (params) => service.queryList(url, params),
  upsert: (params) => service.upsert(url, params),
}
