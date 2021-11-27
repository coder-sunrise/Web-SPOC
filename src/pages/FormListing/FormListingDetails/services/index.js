import * as service from '@/services/common'
import request from '@/utils/request'

const url = '/api/Forms'
const lcformurl = '/api/LCForm'
const consentformurl = '/api/ConsentForm'

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

const saveVisitForm = async (type, visitId, params) => {
  const r = await request(
    `${type === '1' ? lcformurl : consentformurl}/VisitForm/${visitId}`,
    {
      method: 'PUT',
      body: params,
    },
  )
  return r
}
const saveCORForm = async (type, visitId, params) => {
  const r = await request(`${type === '1' ? lcformurl : consentformurl}/CORForm/${visitId}`, {
    method: 'PUT',
    body: params,
  })
  return r
}
const queryCORForm = async (type, params) => {
  const r = await request(`${type === '1' ? lcformurl : consentformurl}/CORForm/${params.id}`, {
    method: 'GET',
    // body: params,
  })
  return r
}

const queryVisitForm = async (type, params) => {
  const r = await request(`${type === '1' ? lcformurl : consentformurl}/VisitForm/${params.id}`, {
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
