import * as service from '@/services/common'
import request from '@/utils/request'

const url = '/api/ctservice'
const getServiceCenterUrl = '/api/ctservicecenter'

const fns = {
  // remove: (params) => service.remove(url, params),
  query: params => {
    return service.query(url, params)
  },
  // upsert: (params) => {
  //   return service.upsert(url, params)
  // },
  queryOne: async serviceId => {
    const response = await request(`${url}/${serviceId}`, {
      method: 'GET',
    })
    return response
  },
  queryList: params => service.queryList(url, params),
  upsert: params => service.upsert(url, params),
  getServiceCenter: params => service.queryList(getServiceCenterUrl, params),
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
