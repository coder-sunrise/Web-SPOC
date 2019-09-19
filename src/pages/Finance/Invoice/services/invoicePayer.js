import * as service from '@/services/common'

const url = '/api/invoicePayer'
const invoicePaymentUrl = '/api/invoicePayment'
const writeOffUrl = '/api/InvoicePayerWriteOff'

module.exports = {
  query: (params) => service.query(url, params),
  upsert: (params) => {
    return service.upsert(invoicePaymentUrl, params)
  },
  writeOff: (params) => {
    return service.upsert(writeOffUrl, params)
  },
}
