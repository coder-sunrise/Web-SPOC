import * as service from '@/services/common'
import request from '@/utils/request'

const url = '/api/deposit'

module.exports = {
  queryList: (params) => service.queryList(url, params),
  upsert: async (params) => {
    const r = await request(`${url}`, {
      method: 'POST',
      body: {
        ...params,
      },
    })
    return r
  },

  query: (params) => service.query(url, params),
}
