export const RejectedCHASColumns = [
  {
    name: 'submissionDate',
    title: 'Submission Date',
  },
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
    name: 'rejectionDate',
    title: 'Rejection Date',
  },
  {
    name: 'rejectionReason',
    title: 'Rejection Reason',
  },
  {
    name: 'action',
    title: 'Action',
  },
]

export const RejectedCHASColumnExtensions = [
  { columnName: 'visitDate', type: 'date' },
  { columnName: 'invoiceDate', type: 'date' },
  { columnName: 'rejectionDate', type: 'date', width: 130 },
  { columnName: 'submissionDate', type: 'date', width: 140 },
  { columnName: 'rejectionReason', width: 400, sortBy: 'ChasClaimStatusDescription' },
  { columnName: 'schemeCategoryDisplayValue', width: 145, sortBy:'schemeCategory' },
  { columnName: 'invoiceAmount', type: 'currency', currency: true, sortBy:'invoiceAmt' },
  { columnName: 'claimAmount', type: 'currency', currency: true, sortBy:'claimAmt' },
]
