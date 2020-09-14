import React, { PureComponent } from 'react'
import Edit from '@material-ui/icons/Edit'
import { status } from '@/utils/codes'
import { CommonTableGrid, Button, Tooltip } from '@/components'

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
      { columnName: 'code', width: 200 },
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
        align: 'center',
        render: (row) => {
          return (
            <Tooltip title='Edit Visit Purpose'>
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
    const { dispatch, settingVisitOrderTemplate } = this.props
    const { list } = settingVisitOrderTemplate

    dispatch({
      type: 'settingVisitOrderTemplate/queryOne',
      payload: {
        id: row.id,
      },
    }).then((v) => {
      if (v) {
        dispatch({
          type: 'settingVisitOrderTemplate/updateState',
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
        type='settingVisitOrderTemplate'
        onRowDoubleClick={this.editRow}
        {...this.configs}
      />
    )
  }
}

export default Grid
