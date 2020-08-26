import React, { PureComponent } from 'react'
import Edit from '@material-ui/icons/Edit'
import { status } from '@/utils/codes'
import { CommonTableGrid, Button, Tooltip } from '@/components'

class Grid extends PureComponent {
  configs = {
    columns: [
      { name: 'code', title: 'Code' },
      { name: 'displayValue', title: 'Name' },
      { name: 'totalPrice', title: 'Selling Price' },
      { name: 'isActive', title: 'Status' },
      { name: 'action', title: 'Action' },
    ],
    columnExtensions: [
      { columnName: 'code', width: 280 },
      { columnName: 'totalPrice', type: 'number', currency: true, width: 120 },
      {
        columnName: 'isActive',
        sortingEnabled: false,
        type: 'select',
        options: status,
        align: 'center',
        width: 80,
      },
      {
        columnName: 'action',
        align: 'center',
        render: (row) => {
          return (
            <Tooltip title='Edit Package'>
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
    const { dispatch, settingPackage } = this.props

    dispatch({
      type: 'settingPackage/queryOne',
      payload: {
        id: row.id,
      },
    }).then((v) => {
      if (v) {
        dispatch({
          type: 'settingPackage/updateState',
          payload: {
            showModal: true,
          },
        })
      }
    })
  }

  render () {
    return (
      <CommonTableGrid
        style={{ margin: 0 }}
        type='settingPackage'
        onRowDoubleClick={this.editRow}
        {...this.configs}
      />
    )
  }
}

export default Grid
