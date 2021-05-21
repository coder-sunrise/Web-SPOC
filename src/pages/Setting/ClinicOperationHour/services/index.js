import * as service from '@/services/common'

const url = '/api/clinicoperationhour'
const fns = {
  remove: params => service.remove(url, params),
  queryList: params => service.queryList(url, params),
  upsert: params => service.upsert(url, params),
}

export default fns
