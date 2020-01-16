import React, { useState } from 'react'
import { connect } from 'dva'
// material ui
import { withStyles } from '@material-ui/core'
import Edit from '@material-ui/icons/Edit'
// common components
import { Button, CardContainer, DragableTableGrid, Tooltip } from '@/components'
import { DeleteWithPopover } from '@/components/_medisys'
import Filterbar from './Filterbar'
import Editor from './Editor'
// utils
import { applyFilter, columns, columnExtensions } from './utils'

const styles = (theme) => ({
  root: {
    marginBottom: theme.spacing(1),
    overflow: 'auto',
    '& h5': {
      fontWeight: 500,
    },
  },
})

const defaultMaxHeight = 600
const CannedText = ({ classes, dispatch, cannedText, user, height }) => {
  const { selectedNote } = cannedText
  const list = cannedText[selectedNote.fieldName]

  const [
    filter,
    setFilter,
  ] = useState('')

  const [
    editEntity,
    setEditEntity,
  ] = useState(undefined)

  const setList = (_list) => {
    dispatch({
      type: 'cannedText/setList',
      payload: {
        field: selectedNote.fieldName,
        list: _list,
      },
    })
  }

  const onDeleteClick = async (id) => {
    const response = await dispatch({
      type: 'cannedText/delete',
      payload: { id, cfg: { message: 'Canned Text Removed' } },
    })

    if (response) {
      await dispatch({
        type: 'cannedText/filterDeleted',
        payload: { id },
      })
      dispatch({
        type: 'cannedText/query',
        payload: selectedNote.cannedTextTypeFK,
      })
    }
  }

  const onEditClick = (id) => {
    const entity = list.find((item) => item.id === id)
    setEditEntity(entity)
    dispatch({
      type: 'global/incrementCommitCount',
    })
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

  const handleEditorConfirmClick = () => {
    clearEditEntity()
  }

  const handleEditorCancelClick = () => {
    clearEditEntity()
  }

  const ActionButtons = (row) => {
    const handleDeleteClick = () => onDeleteClick(row.id)
    const handleEditClick = () => onEditClick(row.id)
    const isOwnCannedText = row.ownedByUserFK === user.id
    return (
      <React.Fragment>
        <Tooltip title='Edit'>
          <Button
            justIcon
            color='primary'
            onClick={handleEditClick}
            disabled={!isOwnCannedText}
          >
            <Edit />
          </Button>
        </Tooltip>
        <DeleteWithPopover
          onConfirmDelete={handleDeleteClick}
          disabled={!!editEntity || !isOwnCannedText}
        />
      </React.Fragment>
    )
  }

  const maxHeight = height ? height - 150 : defaultMaxHeight

  return (
    <div className={classes.root} style={{ maxHeight }}>
      <h5>New Canned Text</h5>
      <Editor
        dispatch={dispatch}
        entity={editEntity}
        onCancel={handleEditorCancelClick}
        onConfirm={handleEditorConfirmClick}
        user={user}
        cannedTextTypeFK={selectedNote.cannedTextTypeFK}
      />
      <h5>Canned Text List</h5>
      <CardContainer hideHeader>
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
        />
      </CardContainer>
    </div>
  )
}

const Connected = connect(({ cannedText, user }) => ({
  cannedText,
  user: user.data,
}))(CannedText)

export default withStyles(styles)(Connected)
