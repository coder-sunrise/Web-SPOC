import * as service from '@/services/common'
import request from '@/utils/request'

const url = '/api/InvoiceClaim'
const countUrl = '/api/InvoiceClaim/Count'
const chasClaimUrl = '/api/InvoiceClaim/SubmitChasClaim'
const refreshPatientUrl = '/api/InvoiceClaim/RefreshPatientDetails'
const chasClaimStatusUrl = '/api/InvoiceClaim/RefreshStatus'
const bizSessionAPIURL = '/api/bizsession'
const invoicePayment = '/api/InvoicePayment'

module.exports = {
  // remove: (params) => service.remove(url, params),
  queryById: (params) => service.query(url, params),
  queryList: (params) => service.queryList(url, params),
  upsert: (params) => service.upsert(url, params),
  queryBadgeCount: (params) => service.query(countUrl, params),
  submitChasClaim: (params) => service.upsert(chasClaimUrl, params),
  postInvoicePayment: async (params) => {
    const r = await request(`${invoicePayment}`, {
      method: 'POST',
      body: [
        params,
      ],
    })
    return r
  },
  getStatus: async (params) => {
    let r
    r = await request(chasClaimStatusUrl, {
      method: 'PUT',
      body: params,
    })
    return r
  },
  refreshPatientDetails: async (params) => {
    let r
    r = await request(refreshPatientUrl, {
      method: 'PUT',
      body: params,
    })
    return r
  },
  getBizSession: (params) => service.queryList(bizSessionAPIURL, params),
}
