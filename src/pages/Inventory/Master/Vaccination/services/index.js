import * as service from '@/services/common'
import request from '@/utils/request'

const url = '/api/InventoryVaccination'

const fns = {
  queryList: params => service.queryList(url, params),
  remove: params => service.remove(url, params),
  query: params => {
    return service.query(url, params)
  },
  upsert: params => {
    return service.upsert(url, params)
  },

  export: () => {
    return request(`${url}/export`, {
      method: 'GET',
      xhrFields: {
        responseType: 'arraybuffer',
      },
    })
  },

  import: params => {
    return request(`${url}/import`, {
      method: 'POST',
      body: params,
      xhrFields: {
        responseType: 'arraybuffer',
      },
    })
  },
}
export default fns
