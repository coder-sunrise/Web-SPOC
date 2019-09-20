import React, { PureComponent } from 'react'
import { Tooltip } from '@material-ui/core'
import Edit from '@material-ui/icons/Edit'
import { status } from '@/utils/codes'
import { CommonTableGrid, Button } from '@/components'
import FromToTime from './FromToTime'

export default class Grid extends PureComponent {
  editRow = (row, e) => {
    const { dispatch, settingClinicBreakHour } = this.props

    const { list } = settingClinicBreakHour

    dispatch({
      type: 'settingClinicBreakHour/updateState',
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
        type='settingClinicBreakHour'
        onRowDoubleClick={this.editRow}
        columns={[
          { name: 'displayValue', title: 'Display Value' },
          { name: 'code', title: 'Code' },
          { name: 'isActive', title: 'Status' },
          { name: 'monFromBreak', title: 'Monday' },
          { name: 'tueFromBreak', title: 'Tuesday' },
          { name: 'wedFromBreak', title: 'Wednesday' },
          { name: 'thursFromBreak', title: 'Thursday' },
          { name: 'friFromBreak', title: 'Friday' },
          { name: 'satFromBreak', title: 'Saturday' },
          { name: 'sunFromBreak', title: 'Sunday' },
          { name: 'action', title: 'Action' },
        ]}
        // FuncProps={{ pager: false }}
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
            width: 60,
            align: 'center',
            render: (row) => {
              return (
                <Tooltip title='Edit Clinic Break Hour' placement='bottom'>
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
            columnName: 'monFromBreak',

            align: 'center',
            render: (row) => {
              return <FromToTime from={row.monFromBreak} to={row.monToBreak} />
            },
          },
          {
            columnName: 'tueFromBreak',
            align: 'center',
            render: (row) => {
              return <FromToTime from={row.tueFromBreak} to={row.tueToBreak} />
            },
          },
          {
            columnName: 'wedFromBreak',
            align: 'center',
            render: (row) => {
              return <FromToTime from={row.wedFromBreak} to={row.wedToBreak} />
            },
          },
          {
            columnName: 'thursFromBreak',
            align: 'center',
            render: (row) => {
              return (
                <FromToTime from={row.thursFromBreak} to={row.thursToBreak} />
              )
            },
          },
          {
            columnName: 'friFromBreak',
            align: 'center',
            render: (row) => {
              return <FromToTime from={row.friFromBreak} to={row.friToBreak} />
            },
          },
          {
            columnName: 'satFromBreak',
            align: 'center',
            render: (row) => {
              return <FromToTime from={row.satFromBreak} to={row.satToBreak} />
            },
          },
          {
            columnName: 'sunFromBreak',
            align: 'center',
            render: (row) => {
              return <FromToTime from={row.sunFromBreak} to={row.sunToBreak} />
            },
          },
        ]}
      />
    )
  }
}
