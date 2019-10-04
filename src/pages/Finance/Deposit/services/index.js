import * as service from '@/services/common'
import request from '@/utils/request'

const url = '/api/deposit'
const bizSessionUrl = '/api/bizSession'
const depositUrl = '/api/Patient/IncludeDepositDetails'

module.exports = {
  queryList: (params) => service.queryList(depositUrl, params),
  upsertDeposit: async (params) => {
    const r = await request(`${url}`, {
      method: 'POST',
      body: {
        ...params,
      },
    })
    return r
  },

  query: (params) => service.query(url, params),
  queryBizSession: (params) => service.queryList(bizSessionUrl, params),
}
