import React, { PureComponent } from 'react'
import Edit from '@material-ui/icons/Edit'
import { CommonTableGrid, Button, dateFormatLong, Tooltip } from '@/components'
import { status } from '@/utils/codes'

export default class Grid extends PureComponent {
  editRow = (row, e) => {
    const { dispatch, settingPublicHoliday } = this.props

    const { list } = settingPublicHoliday

    dispatch({
      type: 'settingPublicHoliday/updateState',
      payload: {
        showModal: true,
        entity: list.find((o) => o.id === row.id),
      },
    })
  }

  render () {
    const { height } = this.props
    return (
      <CommonTableGrid
        onRowDoubleClick={this.editRow}
        style={{ margin: 0 }}
        type='settingPublicHoliday'
        TableProps={{
          height,
        }}
        columns={[
          { name: 'code', title: 'Code' },
          { name: 'displayValue', title: 'Display Value' },
          { name: 'description', title: 'Description' },
          { name: 'startDate', title: 'Start Date' },
          { name: 'endDate', title: 'End Date' },
          { name: 'isActive', title: 'Status' },
          { name: 'action', title: 'Action' },
        ]}
        columnExtensions={[
          {
            columnName: 'displayValue',
            width: 320,
          },
          {
            columnName: 'description',
            width: 380,
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
            render: (row) => {
              return (
                <Tooltip title='Edit Public Holiday'>
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
          {
            columnName: 'startDate',
            type: 'date',
            sortingEnabled: false,
            format: dateFormatLong,
          },
          {
            columnName: 'endDate',
            type: 'date',
            sortingEnabled: false,
            format: dateFormatLong,
          },
        ]}
      />
    )
  }
}
