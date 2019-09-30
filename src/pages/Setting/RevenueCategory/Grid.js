import React, { PureComponent } from 'react'

import { CommonTableGrid, Button, Tooltip } from '@/components'
import { Table } from '@devexpress/dx-react-grid-material-ui'
import { status } from '@/utils/codes'
import Delete from '@material-ui/icons/Delete'
import Edit from '@material-ui/icons/Edit'
import * as service from './services'

class Grid extends PureComponent {
  editRow = (row, e) => {
    const { dispatch, settingRevenue } = this.props

    const { list } = settingRevenue
    // For complex object retrieve from server
    // dispatch({
    //   type: 'settingRevenue/queryOne',
    //   payload: {
    //     id: row.id,
    //   },
    // }).then(toggleModal)
    // console.log(settingRevenue, row.id, e)
    dispatch({
      type: 'settingRevenue/updateState',
      payload: {
        showModal: true,
        entity: list.find((o) => o.id === row.id),
      },
    })
  }

  render () {
    const { dispatch, classes, settingRevenue, toggleModal } = this.props
    return (
      <CommonTableGrid
        style={{ margin: 0 }}
        type='settingRevenue'
        onRowDoubleClick={this.editRow}
        columns={[
          { name: 'code', title: 'Code' },
          { name: 'displayValue', title: 'Display Value' },
          { name: 'description', title: 'Description' },
          { name: 'isActive', title: 'Status' },
          {
            name: 'action',
            title: 'Action',
          },
        ]}
        // FuncProps={{ pager: false }}
        columnExtensions={[
          {
            columnName: 'code',
            width: 280,
          },
          {
            columnName: 'displayValue',
            width: 500,
          },
          {
            columnName: 'description',
            width: 600,
          },
          {
            columnName: 'isActive',
            sortingEnabled: false,
            align: 'center',
            width: 150,
            type: 'select',
            options: status,
          },
          {
            columnName: 'action',
            align: 'center',
            width: 80,
            render: (row) => {
              return (
                <Tooltip title='Edit Revenue Category' placement='top-end'>
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
