import * as service from '@/services/common'

const url = '/api/InventoryMedication'
const sddUrl = 'api/CodeTable?ctnames=ctsdd'
const medicPrecautionUrl = '/api/CodeTable/Search?ctname=ctmedicationprecaution'

module.exports = {
  queryList: (params) => service.queryList(url, params),
  remove: (params) => service.remove(url, params),
  query: (params) => {
    return service.query(url, params)
  },
  querySdd: (params) => {
    return service.querySdd(sddUrl, params)
  },
  upsert: (params) => {
    return service.upsert(url, params)
  },
  queryMedicPrecaution: (params) => service.queryList(medicPrecautionUrl, params),
}
