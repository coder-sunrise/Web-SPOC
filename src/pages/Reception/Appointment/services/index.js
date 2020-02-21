import * as service from '@/services/common'

const url = '/api/appointment'

module.exports = {
  queryList: (params) => service.queryList(url, { ...params, pagesize: 9999 }),

  upsert: (params) => service.upsert(url, params),
}
