import request from '@/utils/request'
import * as service from '@/services/common'

const url = '/api/cestemplate'

module.exports = {
  queryList: (userId) => {
    return request(`${url}/list`, {
      method: 'GET',
    })
  },
  queryOne: (params) => {
    return service.query(url, params)
  },
  remove: (params) => service.remove(url, params),

  create: (name, params) => {
    return request(`${url}?name=${name}`, {
      method: 'POST',
      body: params,
    })
  },
  update: (id, params) => {
    return request(`${url}/replace/${id}`, {
      method: 'PUT',
      body: params,
    })
  },
  delete: (id, userId) => {
    return request(`${url}/${id}`, {
      method: 'DELETE',
    })
  },
}
