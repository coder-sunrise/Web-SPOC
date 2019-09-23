import * as service from '@/services/common'

const url = '/api/invoice'

module.exports = {
  queryList: (params) => service.queryList(url, params),
  query: (params) => service.query(url, params),
  // remove: (params) => service.remove(url, params),
  // query: (params) => { return service.query(url, params) },
  // upsert: (params) => { return service.upsert(url, params) F},
}
