import * as service from '@/services/common'

const url = '/api/referralsource'

const exportFns = {
  queryList: params => service.queryList(url, params),
  upsert: params => service.upsert(url, params),
  remove: params => service.upsert(url, params),
}
const { queryList, upsert, remove } = exportFns
export { queryList, upsert, remove }
