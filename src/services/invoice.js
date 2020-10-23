import * as service from '@/services/common'
import request from '@/utils/request'

const url = '/api/invoice'

module.exports = {
  queryList: (params) => service.queryList(url, params),
  query: (params) => service.query(url, params),
  saveEditInvoice: (payload) => {
    return request(`${url}/saveeditinvoice`, {
      method: 'POST',
      body: payload,
    })
  },
}
