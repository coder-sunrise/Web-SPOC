import * as service from '@/services/common'

const url = '/api/PurchaseOrder'

module.exports = {
  queryList: (params) => service.queryList(url, params),
}
