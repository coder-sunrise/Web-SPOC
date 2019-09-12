import React, { PureComponent } from 'react'
import { CommonTableGrid, Button } from '@/components'
import { Table } from '@devexpress/dx-react-grid-material-ui'
import { status } from '@/utils/codes'
import Delete from '@material-ui/icons/Delete'
import Edit from '@material-ui/icons/Edit'
import moment from 'moment'
import * as service from './services'

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
    const {
      dispatch,
      classes,
      settingClinicOperationHour,
      toggleModal,
    } = this.props

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
            columnName: 'monFromOpHour',

            align: 'center',
            render: (row) => {
              return (
                <p>
                  {moment(row.monFromOpHour, 'HH:mm:ss').format('HH:mm')}
                  {' - '}
                  {moment(row.monToOpHour, 'HH:mm:ss').format('HH:mm')}
                </p>
              )
            },
          },
          {
            columnName: 'tueFromOpHour',
            align: 'center',
            render: (row) => {
              return (
                <p>
                  {moment(row.tueFromOpHour, 'HH:mm:ss').format('HH:mm')}
                  {' - '}
                  {moment(row.tueToOpHour, 'HH:mm:ss').format('HH:mm')}
                </p>
              )
            },
          },
          {
            columnName: 'wedFromOpHour',
            align: 'center',
            render: (row) => {
              return (
                <p>
                  {moment(row.wedFromOpHour, 'HH:mm:ss').format('HH:mm')}
                  {' - '}
                  {moment(row.wedToOpHour, 'HH:mm:ss').format('HH:mm')}
                </p>
              )
            },
          },
          {
            columnName: 'thursFromOpHour',
            align: 'center',
            render: (row) => {
              return (
                <p>
                  {moment(row.thursFromOpHour, 'HH:mm:ss').format('HH:mm')}
                  {' - '}
                  {moment(row.thursToOpHour, 'HH:mm:ss').format('HH:mm')}
                </p>
              )
            },
          },
          {
            columnName: 'friFromOpHour',
            align: 'center',
            render: (row) => {
              return (
                <p>
                  {moment(row.friFromOpHour, 'HH:mm:ss').format('HH:mm')}
                  {' - '}
                  {moment(row.friToOpHour, 'HH:mm:ss').format('HH:mm')}
                </p>
              )
            },
          },
          {
            columnName: 'satFromOpHour',
            align: 'center',
            render: (row) => {
              return (
                <p>
                  {moment(row.satFromOpHour, 'HH:mm:ss').format('HH:mm')}
                  {' - '}
                  {moment(row.satToOpHour, 'HH:mm:ss').format('HH:mm')}
                </p>
              )
            },
          },
          {
            columnName: 'sunFromOpHour',
            align: 'center',
            render: (row) => {
              return (
                <p>
                  {moment(row.sunFromOpHour, 'HH:mm:ss').format('HH:mm')}
                  {' - '}
                  {moment(row.sunToOpHour, 'HH:mm:ss').format('HH:mm')}
                </p>
              )
            },
          },
        ]}
      />
    )
  }
}
