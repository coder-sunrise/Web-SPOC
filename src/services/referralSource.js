import * as service from '@/services/common'

const url = '/api/referralsource'

module.exports = {
  queryList: (params) => service.queryList(url, params),
  upsert: (params) => service.upsert(url, params),
  delete: (params) => service.upsert(url, params),
}
