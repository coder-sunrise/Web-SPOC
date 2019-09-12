import React, { PureComponent } from 'react'

import { CommonTableGrid, Button } from '@/components'
import { Table } from '@devexpress/dx-react-grid-material-ui'
import { status } from '@/utils/codes'
import Delete from '@material-ui/icons/Delete'
import Edit from '@material-ui/icons/Edit'
import { Tooltip } from '@material-ui/core'

class Grid extends PureComponent {
  editRow = (row, e) => {
    const { dispatch, settingConsumableUOM } = this.props

    const { list } = settingConsumableUOM

    dispatch({
      type: 'settingConsumableUOM/updateState',
      payload: {
        showModal: true,
        entity: list.find((o) => o.id === row.id),
      },
    })
  }

  render () {
    const { dispatch, classes, settingConsumableUOM, toggleModal } = this.props
    return (
      <CommonTableGrid
        style={{ margin: 0 }}
        type='settingConsumableUOM'
        onRowDoubleClick={this.editRow}
        columns={[
          { name: 'code', title: 'Code' },
          { name: 'displayValue', title: 'Display Value' },
          { name: 'description', title: 'Description' },
          { name: 'sortOrder', title: 'Sort Order' },
          { name: 'isActive', title: 'Status' },
          {
            name: 'action',
            title: 'Action',
          },
        ]}
        // FuncProps={{ pager: false }}
        columnExtensions={[
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
                <Tooltip title='Edit Consumable UOM' placement='bottom'>
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
        ]}
      />
    )
  }
}

export default Grid
