import { dateFormatLong } from '@/components'

export const TableConfig = {
  // FuncProps: { pager: false },
}

export const InvoiceGridColumns = [
  { name: 'invoiceNo', title: 'Invoice No.' },
  { name: 'invoiceDate', title: 'Invoice Date' },
  { name: 'patientAccountNo', title: 'Patient Acc. No.' },
  { name: 'patientName', title: 'Patient Name' },
  { name: 'invoiceTotalAftGST', title: 'Total After GST' },
  { name: 'totalPayment', title: 'Total Payments' },
  { name: 'patientPayableAmount', title: 'Payable Amount' },
  { name: 'totalCreditNoteAmt', title: 'Credit Notes' },
  { name: 'patientOutstanding', title: 'Patient O/S' },
  { name: 'governmentOutstanding', title: 'Govt. O/S' },
  { name: 'corporateOutstanding', title: 'Corp. O/S' },
  { name: 'totalOutstanding', title: 'Total O/S Bal.' },
]

export const InvoiceGridColExtensions = [
  {
    columnName: 'invoiceDate',
    type: 'date',
    format: dateFormatLong,
  },
  { columnName: 'patientAccountNo', sortingEnabled: false },
  { columnName: 'patientName', sortingEnabled: false },
  {
    columnName: 'invoiceTotalAftGST',
    type: 'currency',
    currency: true,
    sortBy: 'TotalAftGST',
  },
  {
    columnName: 'totalPayment',
    type: 'currency',
    currency: true,
    sortingEnabled: false,
  },
  {
    columnName: 'patientPayableAmount',
    type: 'currency',
    currency: true,
    sortingEnabled: false,
  },
  { columnName: 'totalCreditNoteAmt', type: 'currency', currency: true },
  {
    columnName: 'patientOutstanding',
    type: 'currency',
    currency: true,
    sortingEnabled: false,
  },
  {
    columnName: 'governmentOutstanding',
    type: 'currency',
    currency: true,
    sortingEnabled: false,
  },
  {
    columnName: 'corporateOutstanding',
    type: 'currency',
    currency: true,
    sortingEnabled: false,
  },
  {
    columnName: 'totalOutstanding',
    type: 'currency',
    currency: true,
    sortBy: 'OutstandingBalance',
  },
]
