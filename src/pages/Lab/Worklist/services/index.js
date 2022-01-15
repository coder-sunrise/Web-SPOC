import * as service from '@/services/common'

const url = '/api/labWorklist'

const fns = {
  query: params => service.query(url, { ...params, pagesize: 9999 }),
  queryList: params => service.queryList(url, { ...params, pagesize: 9999 }),
  receiveSpecimen: params => service.upsert(`${url}/receiveSpecimen`, params),
  discardSpecimen: params => service.upsert(`${url}/discardSpecimen`, params),
  startLabTest: params => service.upsert(`${url}/startLabTest`, params),
  saveLabTest: params => service.upsert(`${url}/saveLabTest`, params),
  verifyLabTest: params => service.upsert(`${url}/verifyLabTest`, params),
  upsert: params => service.upsert(url, params),
}
export default fns
