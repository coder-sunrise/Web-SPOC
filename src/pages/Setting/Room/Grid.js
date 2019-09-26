import React, { PureComponent } from 'react'

import { Table } from '@devexpress/dx-react-grid-material-ui'
import Delete from '@material-ui/icons/Delete'
import Edit from '@material-ui/icons/Edit'
import { status } from '@/utils/codes'
import { CommonTableGrid, Button, Tooltip } from '@/components'
import * as service from './services'

class Grid extends PureComponent {
  configs = {
    columns: [
      { name: 'code', title: 'Code' },
      { name: 'displayValue', title: 'Display Value' },
      { name: 'description', title: 'Description' },
      { name: 'isActive', title: 'Status' },
      {
        name: 'action',
        title: 'Action',
      },
    ],
    columnExtensions: [
      { columnName: 'code', width: 200 },
      {
        columnName: 'isActive',
        sortingEnabled: false,
        type: 'select',
        options: status,
        align: 'center',
        width: 100,
      },
      {
        columnName: 'action',
        align: 'center',
        render: (row) => {
          return (
            <Tooltip title='Edit Room'>
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
            </Tooltip>
          )
        },
      },
    ],
  }

  editRow = (row, e) => {
    const { dispatch, settingRoom } = this.props
    const { list } = settingRoom
    // For complex object retrieve from server
    // dispatch({
    //   type: 'settingRoom/queryOne',
    //   payload: {
    //     id: row.id,
    //   },
    // }).then(toggleModal)
    // console.log(settingRoom, row.id, e)
    dispatch({
      type: 'settingRoom/updateState',
      payload: {
        showModal: true,
        entity: list.find((o) => o.id === row.id),
      },
    })
  }

  render () {
    const { dispatch, classes, settingRoom, toggleModal } = this.props

    return (
      <CommonTableGrid
        style={{ margin: 0 }}
        type='settingRoom'
        onRowDoubleClick={this.editRow}
        {...this.configs}
      />
    )
  }
}

export default Grid
