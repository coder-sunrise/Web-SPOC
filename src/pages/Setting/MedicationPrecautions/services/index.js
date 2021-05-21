import * as service from '@/services/common'

const url = '/api/ctmedicationprecaution'

const fns = {
  // remove: (params) => service.remove(url, params),
  // query: (params) => service.query(url, params),
  queryList: params => service.queryList(url, params),
  upsert: params => service.upsert(url, params),
}

export default fns
