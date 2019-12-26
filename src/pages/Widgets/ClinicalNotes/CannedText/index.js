import React, { useState } from 'react'
import { connect } from 'dva'
// material ui
import Edit from '@material-ui/icons/Edit'
// common components
import { Button, DragableTableGrid, Tooltip } from '@/components'
import { DeleteWithPopover } from '@/components/_medisys'
import Filterbar from './Filterbar'
import Editor from './Editor'
// utils
import { applyFilter, columns, columnExtensions, generateData } from './utils'

const CannedText = ({ dispatch, footer, handleAddCannedText }) => {
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
    dispatch({
      type: 'global/incrementCommitCount',
    })
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
        <DeleteWithPopover
          onConfirmDelete={handleDeleteClick}
          disabled={!!editEntity}
        />
      </React.Fragment>
    )
  }

  const handleRowDrop = (rows) => {
    setList(rows)
  }

  const clearEditEntity = () => {
    setEditEntity(undefined)
    dispatch({
      type: 'global/incrementCommitCount',
    })
  }

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

  const handleEditorCancelClick = () => {
    clearEditEntity()
  }

  return (
    <div>
      <Editor
        entity={editEntity}
        onCancel={handleEditorCancelClick}
        onConfirm={handleEditorConfirmClick}
      />
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
      />

      {footer &&
        footer({
          onConfirm: onAddClick,
          confirmBtnText: 'Add',
        })}
    </div>
  )
}

export default connect()(CannedText)
