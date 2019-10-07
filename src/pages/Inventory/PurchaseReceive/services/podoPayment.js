import * as service from '@/services/common'

const bizSessionAPIURL = '/api/bizsession'
const url = '/api/PurchaseOrder/PurchaseOrderPayment'

module.exports = {
  getBizSession: (params) => service.queryList(bizSessionAPIURL, params),
  upsert: (params) => service.upsert(url, params),
}
