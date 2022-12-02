import * as service from '@/services/common'

const url = '/api/ctframetype'

const fns = {
  queryList: params => service.queryList(url, params),
  upsert: params => service.upsert(url, params),
}

export default fns
