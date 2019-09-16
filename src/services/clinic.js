import * as service from '@/services/common'
import request from '@/utils/request'

const url = '/api/clinic'

module.exports = {
  query: (params) => {
    return request(`${url}?clinicCode=${params}`, {
      method: 'GET',
    })
  },

  // upsert: (params) => service.upsert(url, params),
  upsert: async (params) => {
    const r = await request(`${url}`, {
      method: 'PUT',
      body: {
        ...params,
      },
    })
    return r
  },
}
