import moment from 'moment'
import { dateFormatLong } from '@/components'

export const DraftMedisaveColumns = [
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
    name: 'chargeCode',
    title: 'Charge Code',
  },
  {
    name: 'claimStatus',
    title: 'Claim Status',
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

export const DraftMedisaveColumnExtensions = [
  { columnName: 'vistDate', type: 'date' },
  { columnName: 'invoiceDate', type: 'date' },
  { columnName: 'invoiceAmount', type: 'currency', currency: true },
  { columnName: 'claimAmount', type: 'currency', currency: true },
]

const generateDraftMedisaveData = () => {
  let data = []
  for (let i = 0; i < 15; i++) {
    data.push({
      id: i,
      vistDate: moment().formatUTC(dateFormatLong),
      accountNo: 'S1234567D',
      patientName: 'Tan Kok Wei',
      doctor: 'Dr Levine',
      diagnosis: 'Asthma',
      chargeCode: `AB00${i}`,

      invoiceNo: `INV/0000${i}`,
      invoiceDate: moment(),
      invoiceAmount: 100,
      claimAmount: 80,
    })
  }
  return data
}

export const DraftMedisaveTableData = generateDraftMedisaveData()

export const TableConfig = {
  FuncProps: {
    selectable: true,
    selectConfig: { showSelectAll: true },
  },
}

export const NewMedisaveColumns = [
  {
    name: 'hrnNo',
    title: 'HRN No.',
  },
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
    name: 'payerName',
    title: 'Payer Name',
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
    name: 'chargeCode',
    title: 'Charge Code',
  },
  {
    name: 'claimStatus',
    title: 'Claim Status',
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

export const NewMedisaveColumnExtensions = [
  { columnName: 'vistDate', type: 'date' },
  { columnName: 'invoiceDate', type: 'date' },
  { columnName: 'invoiceAmount', type: 'currency', currency: true },
  { columnName: 'claimAmount', type: 'currency', currency: true },
]

const generateNewMedisaveData = () => {
  let data = []
  for (let i = 0; i < 15; i++) {
    data.push({
      id: i,
      vistDate: moment().formatUTC(dateFormatLong),
      accountNo: 'S1234567D',
      patientName: 'Tan Kok Wei',
      payerName: 'Ali',
      doctor: 'Dr Levine',
      diagnosis: 'Asthma',
      chargeCode: `AB00${i}`,

      invoiceNo: `INV/0000${i}`,
      invoiceDate: moment(),
      invoiceAmount: 100,
      claimAmount: 80,
    })
  }
  return data
}

export const NewMedisaveTableData = generateNewMedisaveData()
