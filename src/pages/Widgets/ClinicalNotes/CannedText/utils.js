import { EditorState, ContentState } from 'draft-js'
import _ from 'lodash'
import htmlToDraft from 'html-to-draftjs'
import { Checkbox } from '@/components'
import { htmlDecodeByRegExp } from '@/utils/utils'
import { CANNED_TEXT_TYPE } from '@/utils/constants'

export const CANNED_TEXT_TYPE_FIELD_NAME = {
  [CANNED_TEXT_TYPE.NOTE]: 'note',
  [CANNED_TEXT_TYPE.CHIEFCOMPLAINTS]: 'chiefComplaints',
  [CANNED_TEXT_TYPE.PLAN]: 'plan',
  [CANNED_TEXT_TYPE.HISTORY]: 'history',
}

export const columns = [
  { name: 'drag', title: ' ' },
  { name: 'title', title: 'Title' },
  { name: 'text', title: 'Canned Text' },
  { name: 'isShared', title: 'Is Shared' },
  { name: 'actions', title: 'Action' },
]
export const columnsOthers = [
  { name: 'title', title: 'Title' },
  { name: 'text', title: 'Canned Text' },
]

export const columnExtensions = [
  {
    columnName: 'drag',
    width: 60,
    sortingEnabled: false,
  },
  {
    columnName: 'title',
    width: '25%',
    sortingEnabled: false,
  },
  {
    columnName: 'text',
    render: (row) => {
      const { text } = row
      const contentBlock = htmlToDraft(htmlDecodeByRegExp(text))
      const newEditorState = EditorState.createWithContent(
        ContentState.createFromBlockArray(contentBlock.contentBlocks),
      )
      if (newEditorState) {
        return newEditorState.getCurrentContent().getPlainText()
      }
      return ''
    },
    sortingEnabled: false,
  },
  {
    columnName: 'isShared',
    width: 90,
    align: 'center',
    render: (row) => (
      <Checkbox
        style={{ marginLeft: 30 }}
        checked={row.isShared}
        simple
        disabled
      />
    ),
    sortingEnabled: false,
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

export const applyFilter = (filter, rows, showType, userID, isEdit) => {
  let returnData = [
    ...rows.map((o) => {
      return { ...o, isEdit }
    }),
  ]
  if (showType === 'Self') {
    returnData = _.orderBy(
      returnData.filter((o) => o.ownedByUserFK === userID),
      [
        'sortOrder',
        'title',
      ],
      [
        'asc',
      ],
    )
  } else {
    returnData = _.orderBy(
      returnData.filter((o) => o.ownedByUserFK !== userID),
      [
        'title',
      ],
      [
        'asc',
      ],
    )
  }

  if (filter && filter !== '') {
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
