import * as service from '@/services/common'
import request from '@/utils/request'

const url = '/api/Forms'
const lcformurl = '/api/LCForm'

module.exports = {
  queryList: (params) => service.queryList(url, params),

  getCORForms: async (params) => {
    const r = await request(`${url}/CORForm/${params.id}`, {
      method: 'GET',
      // body: params,
    })
    return r
  },

  getVisitForms: async (params) => {
    const r = await request(`${url}/VisitForm/${params.id}`, {
      method: 'GET',
      // body: params,
    })
    return r
  },

  saveVisitForm: async (visitId, params) => {
    const r = await request(`${lcformurl}/VisitForm/${visitId}`, {
      method: 'PUT',
      body: params,
    })
    return r
  },

  saveCORForm: async (visitId, params) => {
    const r = await request(`${lcformurl}/CORForm/${visitId}`, {
      method: 'PUT',
      body: params,
    })
    return r
  },

  queryCORForm: async (params) => {
    const r = await request(`${lcformurl}/CORForm/${params.id}`, {
      method: 'GET',
      // body: params,
    })
    return r
  },
  queryVisitForm: async (params) => {
    const r = await request(`${lcformurl}/VisitForm/${params.id}`, {
      method: 'GET',
      // body: params,
    })
    return r
  },
}
