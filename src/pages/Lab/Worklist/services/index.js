import * as service from '@/services/common'

const url = '/api/labWorklist'

const fns = {
  query: params => service.query(url, { ...params, pagesize: 9999 }),
  queryList: params => service.queryList(url, { ...params, pagesize: 9999 }),
  receiveSpecimen: params => service.upsert(`${url}/receiveSpecimen`, params),
  discardSpecimen: params => service.upsert(`${url}/discardSpecimen`, params),
  upsert: params => service.upsert(url, params),
}
export default fns
