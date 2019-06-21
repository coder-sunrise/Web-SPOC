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
