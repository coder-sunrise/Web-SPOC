import React, { PureComponent } from 'react'
import Edit from '@material-ui/icons/Edit'
import { CommonTableGrid, Button, Tooltip } from '@/components'
import { status } from '@/utils/codes'

class Grid extends PureComponent {
  editRow = row => {
    if (row.isUserMaintainable) {
      let {
        dispatch,
        settingInstrument: { list },
      } = this.props
      dispatch({
        type: 'settingInstrument/updateState',
        payload: {
          showModal: true,
          entity: list.find(o => o.id === row.id),
        },
      })
    }
  }

  render() {
    let { height } = this.props
    return (
      <CommonTableGrid
        type='settingInstrument'
        onRowDoubleClick={this.editRow}
        TableProps={{
          height,
        }}
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
            columnName: 'sortOrder',
            sortingEnabled: false,
            width: 100,
          },
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
            sortingEnabled: false,
            align: 'center',
            render: row => {
              return (
                <Tooltip title='Edit Grading Chart'>
                  <Button
                    size='sm'
                    onClick={() => {
                      this.editRow(row)
                    }}
                    justIcon
                    color='primary'
                    disabled={!row.isUserMaintainable}
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
