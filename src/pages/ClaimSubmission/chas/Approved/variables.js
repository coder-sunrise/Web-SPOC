export const NewCHASColumns = [
  {
    name: 'visitDate',
    title: 'Visit Date',
  },
  {
    name: 'patientAccountNo',
    title: 'Account No',
  },
  {
    name: 'patientName',
    title: 'Patient Name',
  },
  {
    name: 'visitDoctorName',
    title: 'Doctor',
  },
  {
    name: 'diagnosis',
    title: 'Diagnosis',
  },
  {
    name: 'schemeType',
    title: 'Scheme Type',
  },
  {
    name: 'schemeCategory',
    title: 'Scheme Category',
  },
  {
    name: 'invoiceNo',
    title: 'Invoice No.',
  },
  {
    name: 'invoiceDate',
    title: 'Invoice Date',
  },
  {
    name: 'invoiceAmount',
    title: 'Invoice Amt.',
  },
  {
    name: 'claimAmount',
    title: 'Claim Amt.',
  },
  {
    name: 'submissionDate',
    title: 'Submission Date',
  },
  {
    name: 'chasClaimStatusDescription',
    title: 'Claim Status',
  },
  {
    name: 'approvedAmount',
    title: 'Approved Amt.',
  },
  {
    name: 'collectedPayment',
    title: 'Collected Amt.',
  },
  {
    name: 'action',
    title: 'Action',
  },
]

export const NewCHASColumnExtensions = [
  { columnName: 'visitDate', type: 'date' },
  { columnName: 'invoiceDate', type: 'date' },
  { columnName: 'submissionDate', type: 'date' },
  { columnName: 'invoiceAmount', type: 'currency', currency: true },
  { columnName: 'claimAmount', type: 'currency', currency: true },
  { columnName: 'collectedAmount', type: 'currency', currency: true },
]

export const TableConfig = {
  FuncProps: {
    selectable: true,
    selectConfig: {
      showSelectAll: true,
      rowSelectionEnabled: (row) => true,
    },
  },
}
