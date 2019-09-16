import * as service from '@/services/common'
import request from '@/utils/request'

const gstUrl = '/api/gstsetup'

module.exports = {
  query: (params) => {
    return service.queryList(gstUrl, params)
  },
  upsert: async (params) => {
    const r = await request(`${gstUrl}`, {
      method: 'PUT',
      body: [
        ...params,
      ],
    })
    return r
  },
}
