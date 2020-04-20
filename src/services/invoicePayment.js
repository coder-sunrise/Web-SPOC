import * as service from '@/services/common'
import request from '@/utils/request'

const url = '/api/invoicePayer'
const invoicePaymentUrl = '/api/invoicePayment'
const writeOffUrl = '/api/InvoicePayerWriteOff'
const creditNoteUrl = '/api/CreditNote'
const bizSessionAPIURL = '/api/bizsession'
const transferUrl = `${url}/Transfer`

module.exports = {
  query: (params) => service.query(url, params),
  addPayment: (params) => {
    return request(invoicePaymentUrl, { method: 'POST', body: params })
  },
  writeOff: (params) => {
    return service.upsert(writeOffUrl, params)
  },
  upsert: (params) => {
    return service.upsert(creditNoteUrl, params)
  },

  getBizSession: (params) => service.queryList(bizSessionAPIURL, params),
  voidWriteOff: (params) => service.upsert(writeOffUrl, params),
  voidPayment: (params) => service.upsert(invoicePaymentUrl, params),
  voidCreditNote: (params) => service.upsert(creditNoteUrl, params),

  getTransfer: (params) => service.query(transferUrl, params),
  postTransfer: async (params) => {
    const r = await request(`${transferUrl}/${params.invoicePayerFK}`, {
      method: 'POST',
      body: {
        ...params,
      },
    })
    return r
  },
}
