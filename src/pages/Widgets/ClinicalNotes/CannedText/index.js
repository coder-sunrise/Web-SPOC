import React, { useState } from 'react'
import { connect } from 'dva'
import _ from 'lodash'
// material ui
import { withStyles } from '@material-ui/core'
import Edit from '@material-ui/icons/Edit'
// common components
import { Button, CardContainer, DragableTableGrid, Tooltip } from '@/components'
import { CANNED_TEXT_TYPE } from '@/utils/constants'
import { DeleteWithPopover } from '@/components/_medisys'
import Filterbar from './Filterbar'
import Editor from './Editor'
// utils
import { applyFilter, columns, columnExtensions, columnsOthers } from './utils'

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
  const list = cannedText[selectedNote.fieldName] || []

  const [
    filter,
    setFilter,
  ] = useState('')

  const [
    showType,
    setShowType,
  ] = useState('Self')

  const [
    editEntity,
    setEditEntity,
  ] = useState(undefined)

  const changeOrder = (payload) => {
    dispatch({
      type: 'cannedText/changeOrder',
      payload,
    }).then(() => {
      dispatch({
        type: 'cannedText/query',
        payload: selectedNote.cannedTextTypeFK,
      }).then(() => {
        dispatch({
          type: 'global/incrementCommitCount',
        })
      })
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
        payload: { id, cannedTextTypeFK: selectedNote.cannedTextTypeFK },
      })
      dispatch({
        type: 'cannedText/query',
        payload: selectedNote.cannedTextTypeFK,
      }).then(() => {
        dispatch({
          type: 'global/incrementCommitCount',
        })
      })
    }
  }

  const onEditClick = (id) => {
    const entity = list.find((item) => item.id === id)
    setEditEntity(entity)
  }

  const handleRowDrop = (rows, oldIndex, newIndex) => {
    if (oldIndex !== newIndex) {
      const currentCannedTextId = rows[newIndex].id
      let targetCannedTextId
      let isInsertBefore = false
      if (newIndex < rows.length - 1) {
        targetCannedTextId = rows[newIndex + 1].id
        isInsertBefore = true
      } else {
        targetCannedTextId = rows[newIndex - 1].id
      }
      changeOrder({
        currentCannedTextId,
        targetCannedTextId,
        isInsertBefore,
        cannedTextTypeFK: rows[newIndex].cannedTextTypeFK,
      })
    }
  }

  const clearEditEntity = () => {
    setEditEntity(undefined)
  }

  const handleSearch = (value) => {
    setFilter(value.search)
  }

  const handleEditorConfirmClick = () => {
    dispatch({
      type: 'cannedText/query',
      payload: selectedNote.cannedTextTypeFK,
    }).then(() => {
      dispatch({
        type: 'global/incrementCommitCount',
      })
    })

    clearEditEntity()
  }

  const handleEditorCancelClick = () => {
    clearEditEntity()
  }

  const ActionButtons = (row) => {
    const handleDeleteClick = () => onDeleteClick(row.id)
    const handleEditClick = () => onEditClick(row.id)
    return (
      <React.Fragment>
        <span style={{ display: 'inlineBlock' }}>
          <Tooltip title='Edit'>
            <Button justIcon color='primary' onClick={handleEditClick}>
              <Edit />
            </Button>
          </Tooltip>
        </span>
        <span style={{ display: 'inlineBlock' }}>
          <DeleteWithPopover
            onConfirmDelete={handleDeleteClick}
            disabled={row.isEdit}
          />
        </span>
      </React.Fragment>
    )
  }

  const maxHeight = height ? height - 150 : defaultMaxHeight
  let newcolumns = columns
  if (selectedNote.cannedTextTypeFK === CANNED_TEXT_TYPE.MEDICALCERTIFICATE) {
    newcolumns = columns.filter((t) => t.name !== 'isShared')
  }
  return (
    <div className={classes.root} style={{ maxHeight }}>
      <h5>{!editEntity ? 'New Canned Text' : 'Edit Canned Text'}</h5>
      <Editor
        dispatch={dispatch}
        entity={editEntity}
        onCancel={handleEditorCancelClick}
        handleEditorConfirmClick={handleEditorConfirmClick}
        user={user}
        cannedTextTypeFK={selectedNote.cannedTextTypeFK}
      />
      <h5>Canned Text List</h5>
      <CardContainer hideHeader>
        <Filterbar
          onSearchClick={handleSearch}
          showType={showType}
          setShowType={setShowType}
          cannedTextTypeFK={selectedNote.cannedTextTypeFK}
        />
        <DragableTableGrid
          dataSource={applyFilter(
            filter,
            list,
            showType,
            user.id,
            !_.isEmpty(editEntity),
          )}
          columns={showType === 'Self' ? newcolumns : columnsOthers}
          disableDrag={editEntity}
          columnExtensions={[
            ...columnExtensions,
            {
              columnName: 'actions',
              width: 90,
              render: ActionButtons,
              sortingEnabled: false,
            },
          ]}
          onRowDrop={handleRowDrop}
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
