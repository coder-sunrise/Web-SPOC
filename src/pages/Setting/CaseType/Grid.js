import React, { PureComponent } from 'react'
import Edit from '@material-ui/icons/Edit'
import { CommonTableGrid, Button, Tooltip } from '@/components'
import { status } from '@/utils/codes'


class Grid extends PureComponent {
  editRow = (row, e) => {
    
    if (row.isUserMaintainable) {
      const { dispatch, settingCaseType } = this.props
      const { list } = settingCaseType
      dispatch({
        type: 'settingCaseType/updateState',
        payload: {
          showModal: true,
          entity: list.find((o) => o.id === row.id),
        },
      })
    }
  }

  render () {
    const { height } = this.props
    return (
      <CommonTableGrid
        style={{ margin: 0 }}
        type='settingCaseType'
        onRowDoubleClick={this.editRow}
        TableProps={{
          height,
        }}
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
        columnExtensions={[
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
            render: (row) => {
              return (
                <Tooltip title='Edit Case Type'>
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
