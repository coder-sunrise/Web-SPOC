import * as service from '@/services/common'

const url = '/api/DeliveryOrder'

module.exports = {
  upsert: (params) => service.upsert(url, params),
  queryById: (params) => service.query(url, params),
}
