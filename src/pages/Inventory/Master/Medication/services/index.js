import * as service from '@/services/common'

const url = '/api/InventoryMedication'
const sddUrl = 'api/CodeTable?ctnames=ctsdd'

module.exports = {
  queryList: (params) => service.queryList(url, params),
  remove: (params) => service.remove(url, params),
  query: (params) => {
    return service.query(url, params)
  },
  querySdd: (params) => {
    console.log('query')
    return service.querySdd(sddUrl, params)
  },
  upsert: (params) => {
    return service.upsert(url, params)
  },
}
