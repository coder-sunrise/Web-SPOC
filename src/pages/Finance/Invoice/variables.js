import moment from 'moment'
import { dateFormatLong } from '@/components'
export const TableConfig = {
  // FuncProps: { pager: false },
}

export const InvoiceGridColumns = [
  { name: 'invoiceNo', title: 'Invoice No' },
  { name: 'invoiceDate', title: 'Invoice Date' },
  { name: 'patientID', title: 'Patient ID' },
  { name: 'patientName', title: 'Patient Name' },
  { name: 'totalAfterGST', title: 'Total After GST' },
  { name: 'totalPayment', title: 'Total Payment' },
  { name: 'payableAmount', title: 'PayableAmount' },
  { name: 'creditNote', title: 'Credit Note' },
  { name: 'patientOutstanding', title: 'Patient O/S' },
  { name: 'governmentOutstanding', title: 'Govt. O/S' },
  { name: 'corpOutstanding', title: 'Corp. O/S' },
  { name: 'totalOutstanding', title: 'Total O/S Balance' },
]

export const InvoiceGridColExtensions = [
  { columnName: 'totalAfterGST', type: 'currency', currency: true },
  { columnName: 'totalPayment', type: 'currency', currency: true },
  { columnName: 'payableAmount', type: 'currency', currency: true },
  { columnName: 'creditNote', type: 'currency', currency: true },
  { columnName: 'patientOutstanding', type: 'currency', currency: true },
  { columnName: 'governmentOutstanding', type: 'currency', currency: true },
  { columnName: 'corpOutstanding', type: 'currency', currency: true },
  { columnName: 'totalOutstanding', type: 'currency', currency: true },
]
