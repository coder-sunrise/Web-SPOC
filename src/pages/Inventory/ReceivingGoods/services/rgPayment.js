import * as service from '@/services/common'
import request from '@/utils/request'

const bizSessionAPIURL = '/api/bizsession'
const url = '/api/ReceivingGoods/ReceivingGoodsPayment'

module.exports = {
  getBizSession: (params) => service.queryList(bizSessionAPIURL, params),
  updateRGPayment: async (params) => {
    let r
    if (params.receivingGoodsId) {
      r = await request(`${url}/${params.receivingGoodsId}`, {
        method: 'PUT',
        body: params.paymentData,
      })
    }
    return r
  },
}
