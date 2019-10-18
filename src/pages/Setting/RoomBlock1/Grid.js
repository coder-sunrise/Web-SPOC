import React, { PureComponent } from 'react'
import Delete from '@material-ui/icons/Delete'
import Edit from '@material-ui/icons/Edit'
import { status } from '@/utils/codes'
import { CommonTableGrid, Button, Tooltip } from '@/components'

class Grid extends PureComponent {
  configs = {
    columns: [
      { name: 'displayValue', title: 'Room' },
      { name: 'code', title: 'Code' },
      { name: 'description', title: 'Description' },
      { name: 'isActive', title: 'Status' },
      {
        name: 'action',
        title: 'Action',
      },
    ],
    columnExtensions: [
      {
        columnName: 'isActive',
        sortingEnabled: false,
        type: 'select',
        options: status,
      },
      {
        columnName: 'action',
        align: 'center',
        render: (row) => {
          return (
            <React.Fragment>
              <Button
                size='sm'
                onClick={() => {
                  this.editRow(row)
                }}
                justIcon
                color='primary'
              >
                <Edit />
              </Button>
              <Button
                size='sm'
                onClick={() => {
                  this.deleteRow(row)
                }}
                justIcon
                color='primary'
              >
                <Delete />
              </Button>
            </React.Fragment>
          )
        },
      },
    ],
  }

  editRow = (row, e) => {
    const { dispatch, settingRoomBlock } = this.props

    const { list } = settingRoomBlock
    dispatch({
      type: 'settingRoomBlock/updateState',
      payload: {
        showModal: true,
        entity: list.find((o) => o.id === row.id),
      },
    })
  }

  deleteRow = (row, e) => {
    const { dispatch, settingRoomBlock } = this.props

    const { list } = settingRoomBlock
    dispatch({
      type: 'settingRoomBlock/updateState',
      payload: {
        showModal: true,
        entity: list.find((o) => o.id === row.id),
      },
    })
  }

  render () {
    const { dispatch, classes, settingRoomBlock, toggleModal } = this.props

    return (
      <CommonTableGrid
        style={{ margin: 0 }}
        type='settingRoomBlock'
        onRowDoubleClick={this.editRow}
        {...this.configs}
      />
    )
  }
}

export default Grid
