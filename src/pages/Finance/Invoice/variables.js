import moment from 'moment'

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

const generateInvoiceGridData = () => {
  let data = []
  for (let i = 0; i < 4; i++) {
    data.push({
      id: i,
      invoiceNo: `INV-00${i}`,
      invoiceDate: moment().format('DD MMM YYYY'),
      patientID: 'S1234567D',
      patientName: 'Lee Tian Kang',
      totalAfterGST: 0,
      totalPayment: 0,
      payableAmount: 0,
      creditNote: 0,
      patientOutstanding: 0,
      governmentOutstanding: 0,
      corpOutstanding: 0,
      totalOutstanding: 0,
    })
  }
  return data
}

export const InvoiceGridData = generateInvoiceGridData()
