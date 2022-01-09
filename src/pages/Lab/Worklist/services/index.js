import * as service from '@/services/common'

const url = '/api/labWorklist'

const fns = {
  query: params => service.query(url, params),
  queryList: params => service.queryList(url, { ...params, pagesize: 9999 }),
  upsert: params => service.upsert(url, params),
}
export default fns
