import * as service from '@/services/common'

const url = '/api/radiologyWorklist'

const fns = {
  query: params => service.queryList(url, params),
  queryList: params => service.queryList(url, params),
  upsert: params => service.upsert(url, params),
}
export default fns
