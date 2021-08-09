import * as service from '@/services/common'
import request from '@/utils/request'

const url = '/api/CorporateBilling'
const bizSessionUrl = '/api/bizSession'
const coPayerInvoiceUrl = '/api/Invoice/CoPayerInvoices'

const fns = {
  queryList: params => service.queryList(url, params),
  query: params => {
    return service.query(url, params)
  },

  queryBizSession: params => service.queryList(bizSessionUrl, params),

  queryCompany: params => service.query(`${url}`, params),

  queryCoPayerInvoice: params => service.queryList(coPayerInvoiceUrl, params),
}

export default fns
