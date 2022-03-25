import React, { PureComponent } from 'react'
import Edit from '@material-ui/icons/Edit'
import { CommonTableGrid, Button, Tooltip } from '@/components'
import { status } from '@/utils/codes'

class Grid extends PureComponent {
  editRow = (row, e) => {
    if (row.isUserMaintainable) {
      const { dispatch, settingResource } = this.props

      const { list } = settingResource
      dispatch({
        type: 'settingResource/queryOne',
        payload: {
          id: row.id,
        },
      }).then(r => {
        if (r) {
          dispatch({
            type: 'settingResource/updateState',
            payload: {
              showModal: true,
            },
          })
        }
      })
    }
  }

  render() {
    const { height } = this.props
    return (
      <CommonTableGrid
        style={{ margin: 0 }}
        type='settingResource'
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
          { name: 'balanceTagColorHex', title: 'Bal. Color' },
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
            columnName: 'code',
            width: 200,
          },
          {
            columnName: 'balanceTagColorHex',
            width: 100,
            sortingEnabled: false,
            render: row => (
              <div
                style={{
                  width: '3rem',
                  height: '1rem',
                  borderRadius: '10%',
                  backgroundColor: row.balanceTagColorHex
                    ? row.balanceTagColorHex
                    : '',
                }}
              />
            ),
          },
          {
            columnName: 'sortOrder',
            width: 120,
            render: row => {
              return <p>{row.sortOrder === undefined ? '-' : row.sortOrder}</p>
            },
          },
          {
            columnName: 'action',
            sortingEnabled: false,
            align: 'center',
            render: row => {
              return (
                <Tooltip title='Edit Resource'>
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
