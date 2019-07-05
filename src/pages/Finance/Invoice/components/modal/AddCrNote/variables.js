export const CrNoteColumns = [
  { name: 'type', title: 'Type' },
  { name: 'name', title: 'Name' },
  { name: 'quantity', title: 'Quantity' },
  { name: 'total', title: 'Total ($)' },
  { name: 'action', title: '' },
]

export const CrNoteColExtensions = [
  { columnName: 'quantity', type: 'number' },
  { columnName: 'total', type: 'currency', currency: true },
]

export const TableConfig = {
  FuncProps: {
    selectable: true,
    pager: false,
  },
}

const generateData = () => {
  let data = []
  for (let i = 0; i < 4; i++) {
    data.push({
      id: i,
      type: 'Service',
      name: 'General Consulation Service',
      quantity: 1,
      total: 100,
    })
  }
  return data
}

export const CrNoteData = generateData()
