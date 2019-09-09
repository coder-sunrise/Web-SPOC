import React, { PureComponent } from 'react'

import { CommonTableGrid, Button } from '@/components'
import { Table } from '@devexpress/dx-react-grid-material-ui'
import { status } from '@/utils/codes'
import Delete from '@material-ui/icons/Delete'
import Edit from '@material-ui/icons/Edit'
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
          )
        },
      },
    ],
  }

  editRow = (row, e) => {
    const { dispatch, inventoryAdjustment } = this.props

    const { list } = inventoryAdjustment

    dispatch({
      type: 'inventoryAdjustment/updateState',
      payload: {
        showModal: true,
        entity: list.find((o) => o.id === row.id),
      },
    })
  }

  render () {
    const { dispatch, classes, inventoryAdjustment, toggleModal } = this.props
    return (
      <CommonTableGrid
        style={{ margin: 0 }}
        type='inventoryAdjustment'
        onRowDoubleClick={this.editRow}
        {...this.configs}
      />
    )
  }
}

export default Grid
