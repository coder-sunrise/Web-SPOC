import * as service from '@/services/common'
import request from '@/utils/request'

const url = '/api/InventoryAdjustment'
const runningNoUrl = '/api/InventoryAdjustment/GenerateRunningNo'
const stockUrl = '/api/InventoryAdjustment/StockDetails'

const fns = {
  queryList: params => {
    const { sorting = [] } = params
    const sortOrderByTransactionDate = sorting.find(
      s => s.columnName === 'transactionDate',
    )
    let newParams = params
    if (sortOrderByTransactionDate) {
      newParams = {
        ...params,
        sorting: [
          ...params.sorting,
          {
            columnName: 'transactionDate',
            sortBy: 'createDate',
            direction: sortOrderByTransactionDate.direction,
          },
        ],
      }
    }
    return service.queryList(url, newParams)
  },
  query: params => service.query(url, params),
  queryStockDetails: params => service.query(stockUrl, params),
  upsert: params => service.upsert(url, params),
  getRunningNo: async params => {
    const r = await request(`${runningNoUrl}`, {
      method: 'POST',
    })
    return r
  },
  remove: params => service.remove(url, params),
}
export default fns
