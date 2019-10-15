import * as service from '@/services/common'
import request from '@/utils/request'

const bizSessionAPIURL = '/api/bizsession'
const url = '/api/PurchaseOrder/PurchaseOrderPayment'

module.exports = {
  getBizSession: (params) => service.queryList(bizSessionAPIURL, params),
  updatePodoPayment: async (params) => {
    let r
    if (params.purchaseOrderId) {
      r = await request(`${url}/${params.purchaseOrderId}`, {
        method: 'PUT',
        body: params.paymentData,
      })
    }
    return r
  },
}
