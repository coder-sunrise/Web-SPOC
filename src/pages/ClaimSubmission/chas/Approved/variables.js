import moment from 'moment'
import { dateFormatLong } from '@/components'

export const NewCHASColumns = [
  {
    name: 'vistDate',
    title: 'Visit Date',
  },
  {
    name: 'accountNo',
    title: 'Account No',
  },
  {
    name: 'patientName',
    title: 'Patient Name',
  },
  {
    name: 'doctor',
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
    name: 'rejectionReason',
    title: 'Rejection Reason',
  },
  {
    name: 'action',
    title: 'Action',
  },
]

export const NewCHASColumnExtensions = [
  { columnName: 'vistDate', type: 'date' },
  { columnName: 'invoiceDate', type: 'date' },
  { columnName: 'invoiceAmount', type: 'currency', currency: true },
  { columnName: 'claimAmount', type: 'currency', currency: true },
]

const generateNewCHASData = () => {
  let data = []
  for (let i = 0; i < 15; i++) {
    data.push({
      id: i,
      vistDate: moment().formatUTC({ dateFormatLong }),
      accountNo: 'S1234567D',
      patientName: 'Tan Kok Wei',
      doctor: 'Dr Levine',
      diagnosis: 'Asthma',
      schemeType: 'CHAS Blue',
      schemeCategory: 'Chronic',
      invoiceNo: `INV/0000${i}`,
      invoiceDate: moment(),
      invoiceAmount: 100,
      claimAmount: 80,
      rejectionReason: '',
    })
  }
  return data
}

export const NewCHASTableData = generateNewCHASData()

export const TableConfig = {
  FuncProps: {},
}
