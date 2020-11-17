import { Tooltip } from '@/components'

export const SubmittedMedisaveColumns = [
  {
    name: 'hrnNo',
    title: 'HRN No',
  },
  {
    name: 'submissionDate',
    title: 'Submission Date',
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
    name: 'schemeTypeDisplayValue',
    title: 'Scheme Type',
  },
  {
    name: 'payerName',
    title: 'Payer Name',
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
    name: 'chargeCode',
    title: 'Charge Code',
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
    name: 'chasClaimAmt',
    title: 'CHAS Claim Amt.',
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

export const SubmittedMedisaveColumnExtensions = [
  {
    columnName: 'hrnNo',
    width: 145,
    sortBy: 'Hrn',
  },
  { columnName: 'submissionDate', type: 'date', width: 140 },
  {
    columnName: 'visitDoctorName',
    sortBy: 'DoctorProfileFKNavigation.ClinicianProfile.Name',
  },
  {
    columnName: 'diagnosis',
    sortingEnabled: false,
    render: (row) => {
      let diagnoisisList = row.diagnosis.join(', ')
      return (
        <Tooltip title={diagnoisisList}>
          <span className title={diagnoisisList}>
            {diagnoisisList}
          </span>
        </Tooltip>
      )
    },
  },
  {
    columnName: 'schemeTypeDisplayValue',
    sortBy: 'SchemeTypeFKNavigation.DisplayValue',
  },
  {
    columnName: 'schemeCategoryDisplayValue',
    width: 145,
    sortBy: 'schemeCategory',
  },
  { columnName: 'visitDate', type: 'date' },
  { columnName: 'invoiceDate', type: 'date' },
  {
    columnName: 'invoiceAmount',
    type: 'currency',
    currency: true,
    sortBy: 'invoiceAmt',
  },
  {
    columnName: 'claimAmount',
    type: 'currency',
    currency: true,
    sortBy: 'claimAmt',
  },
  {
    columnName: 'chasClaimAmt',
    type: 'currency',
    currency: true,
    sortBy: 'chasClaimAmt',
  },
]
