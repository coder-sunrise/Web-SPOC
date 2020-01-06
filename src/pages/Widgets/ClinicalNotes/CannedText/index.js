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
import { applyFilter, columns, columnExtensions } from './utils'

const CannedText = ({
  dispatch,
  footer,
  handleAddCannedText,
  // values = { list: [] },
  cannedText,
  user,
}) => {
  const { selectedNote, fields = [] } = cannedText
  const list = cannedText[selectedNote.fieldName]

  const [
    filter,
    setFilter,
  ] = useState('')

  const [
    editEntity,
    setEditEntity,
  ] = useState(undefined)

  const [
    prevIsGlobalTicked,
    setPrevIsGlobalTicked,
  ] = useState(false)

  const setList = (_list) => {
    dispatch({
      type: 'cannedText/setList',
      payload: {
        field: selectedNote.fieldName,
        list: _list,
      },
    })
  }

  const onDeleteClick = (id) => {
    setList(list.map((item) => ({ ...item, isDeleted: item.id === id })))
  }

  const onEditClick = (id) => {
    const entity = list.find((item) => item.id === id)
    const { isGlobal } = entity
    setEditEntity(entity)
    setPrevIsGlobalTicked(isGlobal)
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

  const handleSearch = (value) => {
    setFilter(value.search)
  }

  const updateOtherFields = (entity) => {
    const mapList = (item) =>
      item.id === entity.id ? { ...entity } : { ...item }

    const excludeCurrentSelectedFields = fields.filter(
      (field) => field !== selectedNote.fieldName,
    )

    const updateFieldList = (field) => {
      const _list = cannedText[field]
      const existing = _list.find((item) => item.id === entity.id)
      const result = existing
        ? _list.map(mapList)
        : [
            ..._list,
            entity,
          ]

      dispatch({
        type: 'cannedText/setList',
        payload: {
          field,
          list: result,
        },
      })
    }

    excludeCurrentSelectedFields.forEach(updateFieldList)
  }

  const removeFromOtherFields = (entity) => {
    const excludeCurrentSelectedFields = fields.filter(
      (field) => field !== selectedNote.fieldName,
    )

    const removeFromList = (field) => {
      const _list = cannedText[field]
      dispatch({
        type: 'cannedText/setList',
        payload: {
          field,
          list: _list.map(
            (item) =>
              item.id === entity.id ? { ...item, isDeleted: true } : item,
          ),
        },
      })
    }
    excludeCurrentSelectedFields.forEach(removeFromList)
  }

  const handleEditorConfirmClick = (entity) => {
    const { isGlobal } = entity

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

    if (isGlobal && !prevIsGlobalTicked) updateOtherFields(entity)
    else {
      removeFromOtherFields(entity)
    }
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
        dispatch={dispatch}
        entity={editEntity}
        onCancel={handleEditorCancelClick}
        onConfirm={handleEditorConfirmClick}
        user={user}
        cannedTextTypeFK={selectedNote.cannedTextTypeFK}
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

const Connected = connect(({ cannedText, user }) => ({
  cannedText,
  user: user.data,
}))(CannedText)

export default Connected
