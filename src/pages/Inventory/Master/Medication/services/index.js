import * as service from '@/services/common'
import request from '@/utils/request'

const url = '/api/InventoryMedication'
// const medicPrecautionUrl = '/api/CodeTable/Search?ctname=ctmedicationprecaution'
const medicPrecautionUrl = '/api/ctmedicationprecaution'

module.exports = {
  queryList: (params) => service.queryList(url, params),
  remove: (params) => service.remove(url, params),
  query: (params) => {
    return service.query(url, params)
  },
  upsert: (params) => {
    return service.upsert(url, params)
  },
  queryMedicPrecaution: (params) =>
    service.queryList(medicPrecautionUrl, params),

  export: () => {
    return request(`${url}/export`, {
      method: 'GET',
      xhrFields: {
        responseType: 'arraybuffer',
      },
    })
  },

  import: (params) => {
    return request(`${url}/import`, {
      method: 'POST',
      body: params,
      xhrFields: {
        responseType: 'arraybuffer',
      },
    })
  },
}
