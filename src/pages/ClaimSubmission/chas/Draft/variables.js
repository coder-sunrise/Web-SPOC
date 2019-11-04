export const DraftCHASColumns = [
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
    name: 'schemeTypeDisplayValue',
    title: 'Scheme Type',
  },
  {
    name: 'schemeCategoryDisplayValue',
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
    name: 'action',
    title: 'Action',
  },
]

export const DraftCHASColumnExtensions = [
  { columnName: 'visitDate', type: 'date' },
  { columnName: 'invoiceDate', type: 'date' },
  { columnName: 'invoiceAmount', type: 'currency', currency: true },
  { columnName: 'claimAmount', type: 'currency', currency: true },
]
