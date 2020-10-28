import * as service from '@/services/common'
import request from '@/utils/request'

const url = '/api/queueprocessor'

module.exports = { 
  query: (params) => service.query(url, params),
  queryList: (params) => service.queryList(url, params),
  upsert: (params) => service.upsert(url, params),
  remove: (params) => {
    return request(`${url}/${params.id}`, {
      method: 'DELETE',
      body: '',
    })
  },

}
