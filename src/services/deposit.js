import * as service from '@/services/common'
import request from '@/utils/request'

const url = '/api/deposit'
const bizSessionUrl = '/api/bizSession'
const depositUrl = '/api/Patient/IncludeDepositDetails'

const fns = {
  queryList: params => service.queryList(depositUrl, params),
  upsertDeposit: async params => {
    const r = await request(`${url}`, {
      method: 'POST',
      body: {
        ...params,
      },
    })
    return r
  },
  getPatientDeposit: async params => {
    const r = await request(`${url}/patient`, {
      method: 'GET',
      body: {
        ...params,
      },
    })
    return r
  },
  deleteTransaction: async params => {
    const r = await request(`${url}/transaction/${params.id}`, {
      method: 'DELETE',
      body: params.reason,
    })
    return r
  },

  query: params => service.query(url, params),
  queryBizSession: params => service.queryList(bizSessionUrl, params),
}
export default fns
