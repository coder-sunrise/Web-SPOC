import * as service from '@/services/common'

const url = '/api/ctindividualcomment'

const fns = {
  queryList: params => service.queryList(url, params),
  upsert: params => service.upsert(url, params),
  remove: params => service.remove(url, params),
}

export default fns
