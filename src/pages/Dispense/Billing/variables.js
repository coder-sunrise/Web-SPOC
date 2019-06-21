import moment from 'moment'

export const ItemTableColumn = [
  { name: 'name', title: 'Name' },
  { name: 'coverage', title: 'Coverage' },
  { name: 'payableAmount', title: 'Payable Amount ($)' },
  { name: 'claimAmount', title: 'Claim Amount ($)' },
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
