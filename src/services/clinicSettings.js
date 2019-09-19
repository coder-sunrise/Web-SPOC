import * as service from '@/services/common'
import request from '@/utils/request'

const url = '/api/clinicSettings'

module.exports = {
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
