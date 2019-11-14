import * as service from '@/services/common'
import request from '@/utils/request'

const url = '/api/roomblock'

module.exports = {
  // remove: (params) => service.remove(url, params),

  query: (params) => service.query(url, params),
  queryList: (params) => service.queryList(url, params),
  getList: (params) => service.queryList(url, params),
  upsert: (params) => service.upsert(url, params),
  save: (params) => request(url, { method: 'PUT', body: params }),
  remove: (params) =>
    request(`${url}/${params.id}/false`, { method: 'DELETE' }),
}
