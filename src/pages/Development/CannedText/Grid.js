import React, { useState } from 'react'
import * as Yup from 'yup'
// material ui
import Delete from '@material-ui/icons/Delete'
import Edit from '@material-ui/icons/Edit'
// common components
import { Button, DragableTableGrid, Tooltip } from '@/components'
import Filterbar from './Filterbar'
import Editor from './Editor'

const columns = [
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
  {
    columnName: 'title',
    width: '25%',
  },
]

const ValidationSchema = Yup.object().shape({
  title: Yup.string().required(),
  cannedText: Yup.string().required(),
})

const generateData = () => {
  let data = []
  for (let i = 0; i < 3; i++) {
    data.push({
      id: i,
      title: `Test ${i}`,
      cannedText: `Test canned text ${i}`,
      isSelected: false,
    })
  }
  return data
}

const applyFilter = (filter, rows) => {
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

const Grid = ({ footer, handleAddCannedText }) => {
  const [
    filter,
    setFilter,
  ] = useState('')

  const [
    editEntity,
    setEditEntity,
  ] = useState(undefined)

  const [
    list,
    setList,
  ] = useState(generateData())

  const onDeleteClick = (id) => {
    setList(list.map((item) => ({ ...item, isDeleted: item.id === id })))
  }

  const onEditClick = (id) => {
    setEditEntity(list.find((item) => item.id === id))
  }

  const ActionButtons = (row) => {
    const handleDeleteClick = () => onDeleteClick(row.id)
    const handleEditClick = () => onEditClick(row.id)
    return (
      <React.Fragment>
        <Tooltip title='Edit'>
          <Button justIcon color='primary' onClick={handleEditClick}>
            <Edit />
          </Button>
        </Tooltip>
        <Tooltip title='Delete'>
          <Button justIcon color='danger' onClick={handleDeleteClick}>
            <Delete />
          </Button>
        </Tooltip>
      </React.Fragment>
    )
  }

  const handleRowDrop = (rows) => {
    setList(rows)
  }

  const clearEditEntity = () => setEditEntity(undefined)

  const handleSearch = (values) => {
    setFilter(values.search)
  }

  const handleEditorConfirmClick = (entity) => {
    const mapList = (item) =>
      item.id === entity.id ? { ...entity } : { ...item }
    const existing = list.find((item) => item.id === entity.id)
    if (existing) {
      setList(list.map(mapList))
    } else
      setList([
        ...list,
        entity,
      ])
    clearEditEntity()
  }

  const onAddClick = () => {
    const selectedRows = list.filter((i) => i.isSelected)
    handleAddCannedText(selectedRows)
  }

  return (
    <div>
      <Editor entity={editEntity} onConfirm={handleEditorConfirmClick} />
      <Filterbar onSearchClick={handleSearch} />
      <DragableTableGrid
        dataSource={applyFilter(filter, list)}
        columns={columns}
        columnExtensions={[
          ...columnExtensions,
          {
            columnName: 'actions',
            width: 110,
            render: ActionButtons,
          },
        ]}
        onRowDrop={handleRowDrop}
        handleCommitChanges={handleRowDrop}
        FuncProps={{
          pager: false,
        }}
        schema={ValidationSchema}
      />

      {footer &&
        footer({
          onConfirm: onAddClick,
          confirmBtnText: 'Add',
        })}
    </div>
  )
}

export default Grid
