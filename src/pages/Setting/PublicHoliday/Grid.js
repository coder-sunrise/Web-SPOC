import React, { PureComponent } from 'react'
import { CommonTableGrid, Button, dateFormatLong } from '@/components'
import { Table } from '@devexpress/dx-react-grid-material-ui'
import Delete from '@material-ui/icons/Delete'
import Edit from '@material-ui/icons/Edit'
import moment from 'moment'
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
    const { dispatch, classes, settingPublicHoliday, toggleModal } = this.props

    const dateFormat = 'DD MMM YYYY'
    return (
      <CommonTableGrid
        onRowDoubleClick={this.editRow}
        style={{ margin: 0 }}
        type='settingPublicHoliday'
        columns={[
          { name: 'code', title: 'Code' },
          { name: 'displayValue', title: 'Display Value' },
          { name: 'description', title: 'Description' },
          { name: 'startDate', title: 'Start Date' },
          { name: 'endDate', title: 'End Date' },
          { name: 'isActive', title: 'Status' },
          { name: 'action', title: 'Action' },
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
            align: 'center',
            render: (row) => {
              return (
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
              )
            },
          },
          {
            columnName: 'startDate',
            type: 'date',
            format: dateFormat,
          },
          {
            columnName: 'endDate',
            type: 'date',
            format: dateFormat,
          },
        ]}
      />
    )
  }
}
