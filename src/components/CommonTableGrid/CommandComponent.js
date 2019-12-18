import React from 'react'
import $ from 'jquery'
import _ from 'lodash'

import Delete from '@material-ui/icons/Delete'
import Save from '@material-ui/icons/Save'
import Edit from '@material-ui/icons/Edit'
import Cancel from '@material-ui/icons/Clear'

import { Button, Tooltip } from '@/components'
import { updateGlobalVariable, getGlobalVariable } from '@/utils/utils'

let commitCount = 0
const EditButton = ({ onExecute, text, editingRowIds, disabled = false }) => (
  <Tooltip title={text} placement='top'>
    <Button
      tabindex='0'
      size='sm'
      onClick={(e) => {
        onExecute(e)
        setTimeout(() => {
          if (editingRowIds.length === 0) {
            window.g_app._store.dispatch({
              type: 'global/updateState',
              payload: {
                disableSave: true,
              },
            })
          }
        }, 1)

        // console.log({ onExecute })
      }}
      justIcon
      color='primary'
      disabled={disabled}
    >
      <Edit />
    </Button>
  </Tooltip>
)

const CancelButton = ({
  onExecute,
  text,
  editingRowIds,
  row,
  schema,
  gridId,
  getRowId,
}) => (
  <Tooltip title={text} placement='top'>
    <Button
      tabindex='0'
      size='sm'
      onClick={(e) => {
        // // delete window.$tempGridRow[gridId][row.id]
        // // updateGlobalVariable('gridIgnoreValidation', true)
        // // console.log(editingRowIds, Object.keys(window.$tempGridRow[gridId]))
        // const id = getRowId(row)
        // console.log(id, editingRowIds, window.$tempGridRow, gridId)
        // if (
        //   (!id && editingRowIds.length === 0) ||
        //   (id &&
        //     editingRowIds.length === 1 &&
        //     window.$tempGridRow[gridId] &&
        //     !window.$tempGridRow[gridId][undefined])
        // ) {
        //   window.g_app._store.dispatch({
        //     type: 'global/updateState',
        //     payload: {
        //       disableSave: false,
        //     },
        //   })
        // }
        onExecute(e)
      }}
      justIcon
      color='danger'
      // title='Cancel'
    >
      <Cancel />
    </Button>
  </Tooltip>
)

const DeleteButton = ({ onExecute, text, isDeletable, row, ...restProps }) => {
  return (
    <Tooltip title={text} placement='top'>
      <Button
        tabindex='0'
        size='sm'
        onClick={(e) => {
          // updateGlobalVariable('gridIgnoreValidation', true)
          onExecute(e)
        }}
        disabled={!isDeletable(row)}
        justIcon
        color='danger'
      >
        <Delete />
      </Button>
    </Tooltip>
  )
}

const AddButton = ({ onExecute, text }) => (
  <Tooltip title='Create New Row'>
    <div style={{ textAlign: 'center' }}>
      <Button
        tabindex='0'
        color='primary'
        onClick={(e) => {
          // updateGlobalVariable('gridIgnoreValidation', false)
          onExecute(e)
        }}
        // title='Create new row'
        className='medisys-table-add'
        style={{ display: 'none' }}
      >
        New
      </Button>
    </div>
  </Tooltip>
)

const isDisabled = (props) => {
  const { onExecute, editingRowIds, row, schema, gridId, getRowId } = props
  let disabled = false
  const latestRow = window.$tempGridRow[gridId]
    ? window.$tempGridRow[gridId][getRowId(row)] || row
    : row
  if (schema) {
    try {
      schema.validateSync(latestRow, {
        abortEarly: false,
      })
      // console.log({ r })

      // row._$error = false
    } catch (er) {
      disabled = true
    }
  }
  return {
    disabled,
    row: latestRow,
  }
}
class CommitButton extends React.PureComponent {
  constructor (props) {
    super(props)
    this.myRef = React.createRef()
    this.state = isDisabled(props)

    const { row, schema, gridId, editingRowIds } = props
  }

  static getDerivedStateFromProps (nextProps, preState) {
    const { row, schema, gridId, getRowId } = nextProps
    const latestRow = window.$tempGridRow[gridId]
      ? window.$tempGridRow[gridId][getRowId(row)] || row
      : row
    if (schema && !_.isEqual(preState.row, latestRow)) {
      return isDisabled(nextProps)
    }
    return null
  }

  // componentDidMount () {
  //   const { row, schema, gridId, editingRowIds } = this.props
  // }

  render () {
    const { onExecute, text, editingRowIds, row, schema, gridId } = this.props

    return (
      <div ref={this.myRef} style={{ display: 'inline-block' }}>
        <Tooltip title={text} placement='top'>
          <Button
            tabindex='0'
            size='sm'
            disabled={this.state.disabled}
            onClick={(e) => {
              // if (schema) {
              //   try {
              //     schema.validateSync(
              //       window.$tempGridRow[gridId]
              //         ? window.$tempGridRow[gridId][row.id] || {}
              //         : row,
              //       {
              //         abortEarly: false,
              //       },
              //     )
              //     // console.log({ r })

              //     // row._$error = false
              //   } catch (er) {
              //     // console.log(er)
              //     // $(element).parents('tr').find('.grid-commit').attr('disabled', true)
              //     // console.log(er, this.myRef.current)
              //     $(this.myRef.current).find('button').attr('disabled', true)
              //     // const actualError = er.inner.find((o) => o.path === columnName)
              //     // return actualError ? actualError.message : ''
              //     // row._$error = true
              //     window.g_app._store.dispatch({
              //       type: 'global/updateState',
              //       payload: {
              //         commitCount: commitCount++,
              //       },
              //     })
              //     return false
              //   }
              // }

              // updateGlobalVariable('gridIgnoreValidation', false)
              // if (
              //   (!row.id && editingRowIds.length === 0) ||
              //   (row.id && editingRowIds.length === 1)
              // ) {
              //   window.g_app._store.dispatch({
              //     type: 'global/updateState',
              //     payload: {
              //       disableSave: false,
              //     },
              //   })
              // }
              // delete window.$tempGridRow[gridId][row.id]
              // console.log(window.$tempGridRow[gridId])
              onExecute(e)
            }}
            justIcon
            data-button-type='progress'
            data-grid-button='true'
            color='primary'
            // title='Save'
            className='grid-commit'
          >
            <Save />
          </Button>
        </Tooltip>
      </div>
    )
  }
}

const commandComponents = {
  add: AddButton,
  edit: EditButton,
  delete: DeleteButton,
  commit: CommitButton,
  cancel: CancelButton,
}

const CommandComponent = ({ id, onExecute, ...restProps }) => {
  const CommandButton = commandComponents[id]
  return <CommandButton onExecute={onExecute} {...restProps} />
}

export default CommandComponent
