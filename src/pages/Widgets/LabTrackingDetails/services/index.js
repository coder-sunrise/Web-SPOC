import * as service from '@/services/common'
import request from '@/utils/request'

const url = '/api/ExternalTracking'

const fns = {
  queryList: params => service.queryList(url, params),
  query: params => service.query(url, params),
  upsert: params => service.upsert(url, params),
  writeOff: async params => {
    const r = await request(`${url}/WriteOff`, {
      method: 'PUT',
      body: {
        ...params,
      },
    })
    return r
  },
  export: () => {
    return request(`${url}/export`, {
      method: 'GET',
      xhrFields: {
        responseType: 'arraybuffer',
      },
    })
  },
}

export default fns
