import React, { useState } from 'react'
import { connect } from 'dva'
// material ui
import Delete from '@material-ui/icons/Delete'
// common components
import { Button, CardContainer, DragableTableGrid } from '@/components'

const columns = [
  // { name: 'index', title: '' },
  { name: 'drag', title: ' ' },
  { name: 'title', title: 'Title' },
  { name: 'cannedText', title: 'Canned Text' },
  { name: 'actions', title: 'Action' },
]

const columnExtensions = [
  {
    columnName: 'drag',
    width: 100,
  },
]

const generateData = () => {
  let data = []
  for (let i = 0; i < 10; i++) {
    data.push({
      id: i,
      title: `Test ${i}`,
      cannedText: `Test canned text ${i}`,
    })
  }
  return data
}

const CannedText = () => {
  const [
    list,
    setList,
  ] = useState(generateData())

  const onDeleteClick = (index) => {
    const item = list[index]
    console.log('delete', { item })
  }

  const ActionButtons = (row) => {
    const handleDeleteClick = () => onDeleteClick(row.rowIndex)
    return (
      <Button justIcon onClick={handleDeleteClick}>
        <Delete />
      </Button>
    )
  }

  const handleRowDrop = (rows) => {
    setList(rows)
  }

  return (
    <CardContainer hideHeader>
      <h4>Canned Text</h4>
      <DragableTableGrid
        rows={list}
        columns={columns}
        columnExtensions={[
          ...columnExtensions,
          {
            columnName: 'actions',
            render: ActionButtons,
          },
        ]}
        onRowDrop={handleRowDrop}
        FuncProps={{
          pager: false,
        }}
      />
    </CardContainer>
  )
}

export default connect()(CannedText)
