import * as service from '@/services/common'
import request from '@/utils/request'

const url = '/api/generalsetting'

module.exports = {
  remove: (params) => service.remove(url, params),
  query: (params) => {
    return service.queryList(url, params)
  },
  upsert: async (params) => {
    const r = await request(`${url}`, {
      method: 'PUT',
      body: [
        ...params,
      ],
    })
    return r
  },
}
