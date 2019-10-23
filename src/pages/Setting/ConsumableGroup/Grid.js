import React, { PureComponent } from 'react'

import { CommonTableGrid, Button, Tooltip } from '@/components'
import { Table } from '@devexpress/dx-react-grid-material-ui'
import Edit from '@material-ui/icons/Edit'
import { status } from '@/utils/codes'

class Grid extends PureComponent {
  editRow = (row, e) => {
    const { dispatch, settingConsumableGroup } = this.props

    const { list } = settingConsumableGroup

    dispatch({
      type: 'settingConsumableGroup/updateState',
      payload: {
        showModal: true,
        entity: list.find((o) => o.id === row.id),
      },
    })
  }

  render () {
    const {
      dispatch,
      classes,
      settingConsumableGroup,
      toggleModal,
    } = this.props
    return (
      <CommonTableGrid
        style={{ margin: 0 }}
        type='settingConsumableGroup'
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
        columnExtensions={[
          {
            columnName: 'isActive',
            sortingEnabled: false,
            type: 'select',
            options: status,
            align: 'center',
            width: 120,
          },
          {
            columnName: 'description',
            render: (row) => {
              return <p>{row.description === null ? '-' : row.description}</p>
            },
          },
          {
            columnName: 'sortOrder',
            width: 120,
            render: (row) => {
              return <p>{row.sortOrder === null ? '-' : row.sortOrder}</p>
            },
          },
          {
            columnName: 'action',
            width: 100,
            align: 'center',
            render: (row) => {
              return (
                <Tooltip title='Edit Consumable Category' placement='bottom'>
                  <Button
                    size='sm'
                    onClick={() => {
                      this.editRow(row)
                    }}
                    justIcon
                    color='primary'
                    style={{ marginRight: 0 }}
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
