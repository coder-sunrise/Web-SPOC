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
    console.log(params)
    return service.query(url, params)
  },
  remove: (params) => service.remove(url, params),

  create: (id, name, params) => {
    console.log(id, name, params)
    return request(`${url}/${id}?name=${name}`, {
      method: 'POST',
      body: params,
    })
  },
  update: (id, params) => {
    return request(`${url}/update/${id}`, {
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
