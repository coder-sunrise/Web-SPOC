import * as service from '@/services/common'

const url = '/api/ctgradingchart'

const fns = {
  queryList: params => service.queryList(url, params),
  upsert: params => service.upsert(url, params),
}

export default fns
