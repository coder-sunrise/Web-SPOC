import * as service from '@/services/common'
import request from '@/utils/request'

const url = '/api/Forms'
const lcformurl = '/api/LCForm'
const queryList = params => service.queryList(url, params)
const getCORForms = async params => {
  const r = await request(`${url}/CORForm/${params.id}`, {
    method: 'GET',
    // body: params,
  })
  return r
}
const getVisitForms = async params => {
  const r = await request(`${url}/VisitForm/${params.id}`, {
    method: 'GET',
    // body: params,
  })
  return r
}
const saveVisitForm = async (visitId, params) => {
  const r = await request(`${lcformurl}/VisitForm/${visitId}`, {
    method: 'PUT',
    body: params,
  })
  return r
}
const saveCORForm = async (visitId, params) => {
  const r = await request(`${lcformurl}/CORForm/${visitId}`, {
    method: 'PUT',
    body: params,
  })
  return r
}
const queryCORForm = async params => {
  const r = await request(`${lcformurl}/CORForm/${params.id}`, {
    method: 'GET',
    // body: params,
  })
  return r
}

const queryVisitForm = async params => {
  const r = await request(`${lcformurl}/VisitForm/${params.id}`, {
    method: 'GET',
    // body: params,
  })
  return r
}

export {
  queryList,
  getCORForms,
  getVisitForms,
  saveVisitForm,
  saveCORForm,
  queryCORForm,
  queryVisitForm,
}
