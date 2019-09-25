import request from '@/utils/request'
import { getUniqueGUID, convertToQuery } from '@/utils/utils'
import * as service from '@/services/common'

const url = '/api/consultation'

module.exports = {
  remove: (params) => service.remove(url, params),
  query: (params) => {
    // console.log(url, params)
    return service.query(url, params)
  },
  create: async (visitFK) => {
    const r = await request(`${url}/${visitFK}`, {
      method: 'POST',
    })
    return r
  },
  pause: async (params) => {
    // console.log(params)
    const r = await request(`${url}/${params.id}`, {
      method: 'PUT',
      body: params,
    })
    return r
  },
  resume: async (id) => {
    const r = await request(`${url}/resume/${id}`, {
      method: 'PUT',
    })
    return r
  },
  edit: async (id) => {
    const r = await request(`${url}/edit/${id}`, {
      method: 'PUT',
    })
    return r
  },
  sign: async (params) => {
    const r = await request(`${url}/sign/${params.id}`, {
      method: 'PUT',
      body: params,
    })
    return r
  },
}
