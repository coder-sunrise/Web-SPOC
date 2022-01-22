import React, { PureComponent } from 'react'
import Edit from '@material-ui/icons/Edit'
import { CommonTableGrid, Button, Tooltip } from '@/components'
import { status, isPanelItemRequired } from '@/utils/codes'

class Grid extends PureComponent {
  editRow = (row, e) => {
    if (row.isUserMaintainable) {
      const { dispatch, settingCreditFacility } = this.props

      const { list } = settingCreditFacility
      dispatch({
        type: 'settingCreditFacility/updateState',
        payload: {
          showModal: true,
          entity: list.find(o => o.id === row.id),
        },
      })
    }
  }

  render() {
    const { height } = this.props
    return (
      <CommonTableGrid
        style={{ margin: 0 }}
        type='settingCreditFacility'
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
            columnName: 'isPanelItemRequired',
            align: 'center',
            width: 150,
            type: 'select',
            options: isPanelItemRequired,
            sortBy: 'serviceFKNavigation.isAutoOrder',
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
                <Tooltip title='Edit Credit Facility'>
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
