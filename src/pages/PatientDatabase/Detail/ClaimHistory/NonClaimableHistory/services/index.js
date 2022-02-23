import * as service from '@/services/common'

const url = '/api/patientNonClaimableHistory'

const fns = {
  query: params => service.query(url, params),
  queryList: params => service.queryList(url, params),
  upsert: params => service.upsert(url, params),
  remove: params => service.remove(url, params),
}
export default fns
