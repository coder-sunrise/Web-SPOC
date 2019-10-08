import * as service from '@/services/common'
import request from '@/utils/request'

const url = '/api/ctservicecenter'

module.exports = {
  // remove: (params) => service.remove(url, params),
  // query: (params) => service.query(url, params),
  queryList: (params) => service.queryList(url, params),
  // upsert: (params) => service.upsert(url, params),
  upsertServiceCenter: async (params) => {
    let r
    if (params.id) {
      r = await request(`${url}/${params.id}`, {
        method: 'PUT',
        body: params,
      })
    } else {
      r = await request(`${url}`, {
        method: 'POST',
        body: {
          ...params,
        },
      })
    }
    console.log({ r })
    return r
  },
}
