import React, { PureComponent } from 'react'

import { CommonTableGrid, Button, Tooltip } from '@/components'
import { Table } from '@devexpress/dx-react-grid-material-ui'
import { status } from '@/utils/codes'
import Delete from '@material-ui/icons/Delete'
import Edit from '@material-ui/icons/Edit'
import * as service from './services'

class Grid extends PureComponent {
  editRow = (row, e) => {
    const { dispatch, settingMedicationFrequency } = this.props

    const { list } = settingMedicationFrequency

    dispatch({
      type: 'settingMedicationFrequency/updateState',
      payload: {
        showModal: true,
        entity: list.find((o) => o.id === row.id),
      },
    })
  }

  render () {
    return (
      <CommonTableGrid
        style={{ margin: 0 }}
        type='settingMedicationFrequency'
        onRowDoubleClick={this.editRow}
        columns={[
          { name: 'code', title: 'Code' },
          { name: 'displayValue', title: 'Display Value' },
          { name: 'description', title: 'Description' },
          // { name: 'shortcutKey', title: 'Shortcut' },
          { name: 'multiplier', title: 'Multiplier' },
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
            sortingEnabled: false,
            align: 'center',
            render: (row) => {
              return (
                <Tooltip title='Edit Medication Frequency' placement='bottom'>
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
