import { EditorState, ContentState } from 'draft-js'
import htmlToDraft from 'html-to-draftjs'
import { Checkbox } from '@/components'
import { htmlDecodeByRegExp } from '@/utils/utils'

export const columns = [
  { name: 'drag', title: ' ' },
  { name: 'title', title: 'Title' },
  { name: 'text', title: 'Canned Text' },
  { name: 'isShared', title: 'Is Shared' },
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
  {
    columnName: 'text',
    render: (row) => {
      const { text } = row
      // const encodede = htmlEncodeByRegExp(
      //   draftToHtml(convertToRaw(this.state.value.getCurrentContent())),
      // )
      // console.log({ decodedHtml })
      const contentBlock = htmlToDraft(htmlDecodeByRegExp(text))
      const newEditorState = EditorState.createWithContent(
        ContentState.createFromBlockArray(contentBlock.contentBlocks),
      )
      if (newEditorState) {
        return newEditorState.getCurrentContent().getPlainText()
      }
      return ''
    },
  },
  {
    columnName: 'isShared',
    width: 90,
    render: (row) => <Checkbox checked={row.isShared} simple disabled />,
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
      const { title, text } = each
      const contentBlock = htmlToDraft(htmlDecodeByRegExp(text))
      const newEditorState = EditorState.createWithContent(
        ContentState.createFromBlockArray(contentBlock.contentBlocks),
      )
      let plainText = ''
      if (newEditorState) {
        plainText = newEditorState.getCurrentContent().getPlainText()
      }
      return (
        title.toLowerCase().indexOf(filter) >= 0 ||
        plainText.toLowerCase().indexOf(filter) >= 0
      )
    })
  }
  return returnData
}
