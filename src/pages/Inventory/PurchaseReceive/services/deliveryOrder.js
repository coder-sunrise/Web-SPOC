import * as service from '@/services/common'

const url = '/api/DeliveryOrder'
const runningNumberUrl = '/api/runningNumber'

const fns = {
  upsert: params => service.upsert(url, params),
  queryById: params => service.query(url, params),
  queryRunningNumber: params =>
    service.query(`${runningNumberUrl}/${params.prefix}`, params),
}

export default fns
