import * as service from '@/services/common'
import request from '@/utils/request'

const url = '/api/Statement'
const invoiceUrl = '/api/Invoice'
// const runningNoUrl = '/api/InventoryAdjustment/GenerateRunningNo'
// const stockUrl = '/api/InventoryAdjustment/StockDetails'

module.exports = {
  queryList: (params) => service.queryList(url, params),
  upsert: (params) => service.upsert(url, params),

  queryInvoiceList: (params) => service.queryList(invoiceUrl, params),

  // query: (params) => service.query(url, params),
  // queryStockDetails: (params) => service.query(stockUrl, params),

  // getRunningNo: async (params) => {
  //   const r = await request(`${runningNoUrl}`, {
  //     method: 'POST',
  //   })
  //   return r
  // },
  // remove: (params) => service.remove(url, params),
}
