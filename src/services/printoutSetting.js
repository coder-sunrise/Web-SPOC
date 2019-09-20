import * as service from '@/services/common'
import request from '@/utils/request'

const url = '/api/printoutSetting'

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
