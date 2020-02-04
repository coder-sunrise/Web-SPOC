import request from '@/utils/request'
import * as service from '@/services/common'

const url = '/api/ctchartmethod'
module.exports = {
  // remove: (params) => service.remove(url, params),
  query: (params) => service.query(url, params),
  queryList: (params) => service.queryList(url, params),
  post: async (params) => {
    const r = await request(`${url}/save`, {
      method: 'POST',
      body: params,
    })
    return r
  },
}
