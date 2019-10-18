import React, { PureComponent } from 'react'
import Delete from '@material-ui/icons/Delete'
import Edit from '@material-ui/icons/Edit'
import { CommonTableGrid, Button } from '@/components'
import { status } from '@/utils/codes'

class Grid123 extends PureComponent {
  configs = {
    columns: [
      { name: 'room.displayValue', title: 'Room' },
      { name: 'room.code', title: 'Code' },
      { name: 'room.description', title: 'Description' },
      { name: 'room.isActive', title: 'Status' },
      {
        name: 'action',
        title: 'Action',
      },
    ],
    columnExtensions: [
      {
        columnName: 'room.isActive',
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
    FuncProps: {
      // pager: true,
      tree: true,
      treeColumnConfig: {
        for: 'displayValue',
      },
    },
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
    console.log('settingRoomBlock', this.props.settingRoomBlock)
    return (
      <CommonTableGrid
        style={{ margin: 0 }}
        type='settingRoomBlock.list'
        onRowDoubleClick={this.editRow}
        {...this.configs}
      />
    )
  }
}

export default Grid123
