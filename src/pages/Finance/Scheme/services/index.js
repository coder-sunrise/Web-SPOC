import * as service from '@/services/common'

const url = '/api/CoPaymentScheme'

module.exports = {
  remove: (params) => service.remove(url, params),
  queryList: (params) => {
    return service.queryList(url, params)
  },
  query: (params) => {
    return service.query(url, params)
  },
  upsert: (params) => {
    return service.upsert(url, params)
  },
}
