import request from '@/utils/request'
import * as service from '@/services/common'

const url = '/api/consulation'

module.exports = {
  remove: (params) => service.remove(url, params),
  query: (params) => {
    return service.query(url, params)
  },
  upsert: (params) => {
    return service.upsert(url, params)
  },
  create: (visitFK) => {
    return request(`${url}/${visitFK}`, {
      method: 'POST',
    })
  },
}
