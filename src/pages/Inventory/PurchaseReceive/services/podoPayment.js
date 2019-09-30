import * as service from '@/services/common'

const url = '/api/PurchaseOrder/PurchaseOrderPayment'

module.exports = {
  upsert: (params) => service.upsert(url, params),
}
