import * as service from '@/services/common'
import request from '@/utils/request'

const url = '/api/deposit'
const bizSessionUrl = '/api/bizSession'

module.exports = {
  queryList: (params) => service.queryList(url, params),
  upsert: async (params) => {
    const r = await request(`${url}`, {
      method: 'POST',
      body: {
        ...params,
      },
    })
    console.log({ r })
    return r
  },

  query: (params) => service.query(url, params),
  queryBizSession: (params) => service.queryList(bizSessionUrl, params),
}
