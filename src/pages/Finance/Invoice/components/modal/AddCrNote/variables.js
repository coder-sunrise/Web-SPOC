export const CrNoteColumns = [
  { name: 'itemType', title: 'Type' },
  { name: 'itemName', title: 'Name' },
  { name: 'quantity', title: 'Quantity' },
  { name: 'unitPrice', title: 'Unit Price' },
  { name: 'totalAfterItemAdjustment', title: 'Total ($)' },
  { name: 'action', title: 'Action' },
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
