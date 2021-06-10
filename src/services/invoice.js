import * as service from '@/services/common'
import request from '@/utils/request'

const url = '/api/invoice'

const fns = {
  queryList: params => service.queryList(url, params),
  query: params => service.query(url, params),
  saveEditInvoice: payload => {
    return request(`${url}/saveeditinvoice`, {
      method: 'POST',
      body: payload,
    })
  },
}
export default fns
