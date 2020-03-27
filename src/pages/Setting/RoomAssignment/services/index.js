import * as service from '@/services/common'
import request from '@/utils/request'

const url = '/api/roomassignment'

module.exports = {
  // remove: (params) => service.remove(url, params),
  query: (params) => service.query(url, params),
  queryList: (params) => service.queryList(url, params),
  upsert: async (params) => {
    const r = await request(`${url}`, {
      method: 'POST',
      body: [
        ...params,
      ],
    })
    return r
  },
}
