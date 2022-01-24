import * as service from '@/services/common'
import request from '@/utils/request'

const url = '/api/PurchaseRequest'
const runningNumberUrl = '/api/runningNumber'

const fns = {
  queryList: params => service.queryList(url, params),
  upsert: params => service.upsert(url, params),
  queryById: params => service.query(url, params),
  queryRunningNumber: params =>
    service.query(`${runningNumberUrl}/${params.prefix}`, params),
  delete: params => service.upsert(`${url}/delete`, params),
}

export default fns
