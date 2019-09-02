import * as service from '@/services/common'
import request from '@/utils/request'

const url = '/api/ctservice'

module.exports = {
  // remove: (params) => service.remove(url, params),
  // query: (params) => {
  //   return service.query(url, params)
  // },
  // upsert: (params) => {
  //   return service.upsert(url, params)
  // },
  queryOne: async (serviceId) => {
    const response = await request(`${url}/${serviceId}`, {
      method: 'GET',
    })
    return response
  },
  queryList: (params) => service.queryList(url, params),
  upsert: (params) => service.upsert(url, params),
}
