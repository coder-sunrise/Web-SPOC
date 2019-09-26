import * as service from '@/services/common'

const url = '/api/InventoryMedication'
const medicPrecautionUrl = '/api/CodeTable/Search?ctname=ctmedicationprecaution'

module.exports = {
  queryList: (params) => service.queryList(url, params),
  remove: (params) => service.remove(url, params),
  query: (params) => {
    console.log(params)
    return service.query(url, params)
  },
  upsert: (params) => {
    return service.upsert(url, params)
  },
  queryMedicPrecaution: (params) =>
    service.queryList(medicPrecautionUrl, params),
}
