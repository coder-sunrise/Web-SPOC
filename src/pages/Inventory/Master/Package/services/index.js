import * as service from '@/services/common'

const url = '/api/InventoryPackage'
const serviceCenterUrl = '/api/CodeTable/Search?ctname=ctservicecenter'
module.exports = {
  queryList: (params) => service.queryList(url, params),
  remove: (params) => service.remove(url, params),
  query: (params) => {
    return service.query(url, params)
  },
  upsert: (params) => {
    return service.upsert(url, params)
  },
  queryServiceCenter: (params) => service.queryList(serviceCenterUrl, params),
}
