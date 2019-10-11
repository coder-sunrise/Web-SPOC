import moment from 'moment'
// common components
import { NumberInput, FastField } from '@/components'

export const ItemTableColumn = [
  { name: 'itemCode', title: 'Name' },
  { name: 'coverage', title: 'Coverage' },
  { name: 'totalAftGst', title: 'Payable Amount ($)' },
  { name: 'claimAmount', title: 'Claim Amount ($)' },
]

export const ItemTableColumnExtensions = (index) => [
  { columnName: 'totalAftGst', type: 'currency', currency: true },
  // { columnName: 'claimAmount', type: 'currency', currency: true },
  {
    columnName: 'claimAmount',
    render: (row) => (
      <FastField
        name={`claims[${index}]${row.id}`}
        render={(args) => <NumberInput {...args} currency />}
      />
    ),
  },
]

const generateItemData = () => {
  let data = []
  for (let i = 0; i < 4; i++) {
    data.push({
      id: i,
      name: 'Aspirin',
      coverage: '',
      payableAmount: 20,
      claimAmount: 10,
    })
  }
  return data
}

export const ItemData = generateItemData()

export const ClaimSequenceColumns = [
  { name: 'company', title: 'Company' },
  { name: 'cardOrAccountNo', title: 'Card/AccountNo' },
  { name: 'validFrom', title: 'Valid From' },
  { name: 'validTo', title: 'Valid To' },
]

export const ClaimSequenceColExtensions = [
  { columnName: 'validFrom', type: 'date' },
  { columnName: 'validTo', type: 'date' },
]

const generateClaimSequenceData = () => {
  let data = []
  for (let i = 0; i < 4; i++) {
    data.push({
      id: i,
      company: `CHAS PA ${i}`,
      cardOrAccountNo: 'G1234567D',
      validFrom: moment(),
      validTo: moment(),
    })
  }
  return data
}

export const ClaimSequenceData = generateClaimSequenceData()

export const CoPayerColumns = [
  { name: 'itemCode', title: 'Name' },
  { name: 'totalAftGst', title: 'Payable Amount' },
  {
    name: 'claimAmount',
    title: 'Claim Amount',
  },
]

export const CoPayerColExtensions = [
  { columnName: 'totalAftGst', type: 'currency', currency: true },
  {
    columnName: 'claimAmount',
    // type: 'currency',
    // currency: true,
    render: (row) => (
      <FastField
        name={`coPayer[${row.rowIndex}]claimAmount`}
        render={(args) => <NumberInput {...args} size='sm' />}
      />
    ),
  },
]

const generateCoPayerData = () => {
  let data = []
  for (let i = 0; i < 4; i++) {
    data.push({
      id: i,
      name: `CHAS PA ${i}`,
      payableAmount: 100,
      claimAmount: 20,
    })
  }
  return data
}

export const CoPayerData = generateCoPayerData()
