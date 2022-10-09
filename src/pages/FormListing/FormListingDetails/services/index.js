import * as service from '@/services/common'
import request from '@/utils/request'

const url = '/api/Forms'
const formurl = '/api/Form'

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
  const r = await request(`${formurl}/VisitForm/${visitId}`, {
    method: 'PUT',
    body: params,
  })
  return r
}
const saveCORForm = async (type, visitId, params) => {
  const { action } = params
  let url = `${formurl}/CORForm/${visitId}`
  if (type !== '1' && action === 'finalize')
    url = `${formurl}/CORForm/Finalize/${visitId}`
  else if (type !== '1' && action === 'void')
    url = `${formurl}/CORForm/Void/${visitId}`
  const r = await request(url, {
    method: 'PUT',
    body: params,
  })
  return r
}
const queryCORForm = async (type, params) => {
  const r = await request(`${formurl}/CORForm/${params.id}`, {
    method: 'GET',
    // body: params,
  })
  return r
}

const queryVisitForm = async (type, params) => {
  const r = await request(`${formurl}/VisitForm/${params.id}`, {
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
