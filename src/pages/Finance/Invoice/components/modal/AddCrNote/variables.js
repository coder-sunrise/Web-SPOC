export const TableConfig = {
  FuncProps: {
    selectable: true,
    // selectConfig: {
    //   showSelectAll: false,
    //   rowSelectionEnabled: (row) => row.itemType !== 'Misc',
    // },
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
