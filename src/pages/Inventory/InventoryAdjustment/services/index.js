import * as service from '@/services/common'
import request from '@/utils/request'

const url = '/api/InventoryAdjustment'
const runningNoUrl = '/api/InventoryAdjustment/GenerateRunningNo'
const stockUrl = '/api/InventoryAdjustment/StockDetails'

module.exports = {
  queryList: (params) => service.queryList(url, params),
  query: (params) => service.query(url, params),
  queryStockDetails: (params) => service.query(stockUrl, params),
  upsert: (params) => service.upsert(url, params),
  getRunningNo: async (params) => {
    const r = await request(`${runningNoUrl}`, {
      method: 'POST',
    })
    return r
  },
  remove: (params) => service.remove(url, params),
}
