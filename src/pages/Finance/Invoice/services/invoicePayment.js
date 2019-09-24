import * as service from '@/services/common'

const url = '/api/invoicePayer'
const invoicePaymentUrl = '/api/invoicePayment'
const writeOffUrl = '/api/InvoicePayerWriteOff'
const creditNoteUrl = 'api/CreditNote'

module.exports = {
  query: (params) => service.query(url, params),
  addPayment: (params) => {
    return service.upsert(invoicePaymentUrl, params)
  },
  writeOff: (params) => {
    return service.upsert(writeOffUrl, params)
  },
  addCreditNote: (params) => {
    return service.upsert(creditNoteUrl, params)
  },
}
