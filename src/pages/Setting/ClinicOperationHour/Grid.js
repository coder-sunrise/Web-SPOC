import React, { PureComponent } from 'react'
import Edit from '@material-ui/icons/Edit'
import { Tooltip } from '@material-ui/core'
import { status } from '@/utils/codes'
import { CommonTableGrid, Button } from '@/components'
import FromToTime from '../ClinicBreakHour/FromToTime'

export default class Grid extends PureComponent {
  editRow = (row, e) => {
    const { dispatch, settingClinicOperationHour } = this.props

    const { list } = settingClinicOperationHour

    dispatch({
      type: 'settingClinicOperationHour/updateState',
      payload: {
        showModal: true,
        entity: list.find((o) => o.id === row.id),
      },
    })
  }

  render () {
    return (
      <CommonTableGrid
        style={{ margin: 0 }}
        onRowDoubleClick={this.editRow}
        type='settingClinicOperationHour'
        columns={[
          { name: 'code', title: 'Code' },
          { name: 'displayValue', title: 'Display Value' },
          { name: 'isActive', title: 'Status' },
          { name: 'monFromOpHour', title: 'Monday' },
          { name: 'tueFromOpHour', title: 'Tuesday' },
          { name: 'wedFromOpHour', title: 'Wednesday' },
          { name: 'thursFromOpHour', title: 'Thursday' },
          { name: 'friFromOpHour', title: 'Friday' },
          { name: 'satFromOpHour', title: 'Saturday' },
          { name: 'sunFromOpHour', title: 'Sunday' },
          { name: 'action', title: 'Action' },
        ]}
        columnExtensions={[
          {
            columnName: 'isActive',
            sortingEnabled: false,
            type: 'select',
            options: status,
            width: 70,
            align: 'center',
          },
          {
            columnName: 'displayValue',
            width: 300,
          },
          {
            columnName: 'action',
            align: 'center',
            width: 60,
            render: (row) => {
              return (
                <Tooltip title='Edit Clinic Operation Hour' placement='bottom'>
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
          {
            columnName: 'monFromOpHour',
            sortingEnabled: false,
            align: 'center',
            render: (row) => {
              return (
                <FromToTime from={row.monFromOpHour} to={row.monToOpHour} />
              )
            },
          },
          {
            columnName: 'tueFromOpHour',
            sortingEnabled: false,
            align: 'center',
            render: (row) => {
              return (
                <FromToTime from={row.tueFromOpHour} to={row.tueToOpHour} />
              )
            },
          },
          {
            columnName: 'wedFromOpHour',
            sortingEnabled: false,
            align: 'center',
            render: (row) => {
              return (
                <FromToTime from={row.wedFromOpHour} to={row.wedToOpHour} />
              )
            },
          },
          {
            columnName: 'thursFromOpHour',
            sortingEnabled: false,
            align: 'center',
            render: (row) => {
              return (
                <FromToTime from={row.thursFromOpHour} to={row.thursToOpHour} />
              )
            },
          },
          {
            columnName: 'friFromOpHour',
            sortingEnabled: false,
            align: 'center',
            render: (row) => {
              return (
                <FromToTime from={row.friFromOpHour} to={row.friToOpHour} />
              )
            },
          },
          {
            columnName: 'satFromOpHour',
            sortingEnabled: false,
            align: 'center',
            render: (row) => {
              return (
                <FromToTime from={row.satFromOpHour} to={row.satToOpHour} />
              )
            },
          },
          {
            columnName: 'sunFromOpHour',
            sortingEnabled: false,
            align: 'center',
            render: (row) => {
              return (
                <FromToTime from={row.sunFromOpHour} to={row.sunToOpHour} />
              )
            },
          },
        ]}
      />
    )
  }
}
