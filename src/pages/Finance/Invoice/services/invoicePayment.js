import * as service from '@/services/common'

const invoicePayerUrl = '/api/invoicePayer'
const invoicePaymentUrl = '/api/invoicePayment'

module.exports = {
  query: (params) => service.query(invoicePayerUrl, params),
  upsert: (params) => {
    return service.upsert(invoicePaymentUrl, params)
  },
}
