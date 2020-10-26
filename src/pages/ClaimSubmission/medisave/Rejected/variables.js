import { Tooltip } from '@/components'
import Warining from '@material-ui/icons/Error'

export const RejectedMedisaveColumns = [
  {
    name: 'hrnNo',
    title: 'HRN No',
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

export const RejectedMedisaveColumnExtensions = [
  { columnName: 'visitDate', type: 'date' },
  { columnName: 'invoiceDate', type: 'date' },
  { columnName: 'rejectionDate', type: 'date', width: 130 },
  { columnName: 'submissionDate', type: 'date', width: 140 },
  {
    columnName: 'patientName',
    render: (row) => {
      return (
        <Tooltip
          title={
            row.patientIsActive ? (
              row.patientName
            ) : (
              'This patient has been inactived.'
            )
          }
        >
          <span>
            {!row.patientIsActive && (
              <Warining color='error' style={{ marginRight: 5 }} />
            )}
            {row.patientName}
          </span>
        </Tooltip>
      )
    },
  },
  {
    columnName: 'rejectionReason',
    width: 400,
    sortBy: 'ChasClaimStatusDescription',
  },
  {
    columnName: 'schemeCategoryDisplayValue',
    width: 145,
    sortBy: 'schemeCategory',
  },
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
]
