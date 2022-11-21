import { CLINIC_TYPE } from '@/utils/constants'

export const CannedTextColumns = [
  { name: 'drag', title: ' ' },
  { name: 'title', title: 'Title' },
  { name: 'cannedText', title: 'Canned Text' },
  { name: 'actions', title: 'Action' },
]

export const CannedTextColumnExtensions = [
  {
    columnName: 'drag',
    width: 100,
  },
  {
    columnName: 'title',
    width: '25%',
  },
]

export const applyFilter = (filter, rows) => {
  let returnData = [...rows]
  if (filter !== '') {
    returnData = returnData.filter(each => {
      const { title, cannedText } = each
      return (
        title.toLowerCase().indexOf(filter) >= 0 ||
        cannedText.toLowerCase().indexOf(filter) >= 0
      )
    })
  }
  return returnData
}
