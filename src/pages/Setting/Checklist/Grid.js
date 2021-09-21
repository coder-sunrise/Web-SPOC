import React, { PureComponent } from 'react'
import { CommonTableGrid, Button, Tooltip } from '@/components'
import { status } from '@/utils/codes'
import Edit from '@material-ui/icons/Edit'

class Grid extends PureComponent {
  editRow = (row, e) => {
    const { dispatch } = this.props
    dispatch({
      type: 'settingChecklist/queryOne',
      payload: {
        id: row.id,
      },
    }).then((v) => {
      if (v) {
        dispatch({
          type: 'settingChecklist/updateState',
          payload: {
            showModal: true,
          },
        })
      }
    })
  }

  render() {
    const { height } = this.props
    return (
      <CommonTableGrid
        style={{ margin: 0 }}
        type='settingChecklist'
        onRowDoubleClick={this.editRow}
        TableProps={{
          height,
        }}
        columns={[
          { name: 'code', title: 'Code' },
          { name: 'displayValue', title: 'Display Value' },
          { name: 'description', title: 'Description' },
          {
            name: 'checklistCategoryDisplayValue',
            title: 'Checklist Category',
          },
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
            align: 'center',
            type: 'select',
            width: 100,
            options: status,
          },
          { columnName: 'sortOrder', width: 110 },
          {
            columnName: 'checklistCategoryDisplayValue',
            sortingEnabled: false,
          },
          {
            columnName: 'action',
            align: 'center',
            sortingEnabled: false,
            render: row => {
              return (
                <Tooltip title='Edit Checklist' placement='top-end'>
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
