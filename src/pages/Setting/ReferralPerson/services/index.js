import * as service from '@/services/common'

const url = '/api/referralperson'

module.exports = {
  queryList: (params) => service.queryList(url, params),
  upsert: (params) => service.upsert(url, params),
}
