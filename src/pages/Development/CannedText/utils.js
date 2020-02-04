export const columns = [
  { name: 'drag', title: ' ' },
  { name: 'title', title: 'Title' },
  { name: 'cannedText', title: 'Canned Text' },
  { name: 'actions', title: 'Action' },
]

export const columnExtensions = [
  {
    columnName: 'drag',
    width: 100,
  },
  {
    columnName: 'title',
    width: '25%',
  },
]

export const generateData = () => {
  let data = []
  for (let i = 0; i < 3; i++) {
    data.push({
      id: i,
      title: `Test ${i}`,
      cannedText: `Test canned text ${i}`,
      htmlCannedText: `Test canned text ${i}`,
      isSelected: false,
    })
  }
  return data
}

export const applyFilter = (filter, rows) => {
  let returnData = [
    ...rows,
  ]
  if (filter !== '') {
    returnData = returnData.filter((each) => {
      const { title, cannedText } = each
      return (
        title.toLowerCase().indexOf(filter) >= 0 ||
        cannedText.toLowerCase().indexOf(filter) >= 0
      )
    })
  }
  return returnData
}
