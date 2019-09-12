import React, { useMemo } from 'react'
import { connect } from 'dva'
// material ui
import Edit from '@material-ui/icons/Edit'
// common component
import { CommonTableGrid, Button } from '@/components'
// utils
import { status } from '@/utils/codes'

const columns = [
  { name: 'code', title: 'Code' },
  { name: 'displayValue', title: 'Display Value' },
  { name: 'tagColorHex', title: 'Appt. Type Color' },
  { name: 'isActive', title: 'Status' },
  {
    name: 'action',
    title: 'Action',
  },
]

class Grid extends React.PureComponent {
  state = {
    columnExtensions: [
      {
        columnName: 'isActive',
        sortingEnabled: false,
        type: 'select',
        options: status,
      },
      {
        columnName: 'tagColorHex',
        render: (row) => (
          <div
            style={{
              width: '3rem',
              height: '1rem',
              borderRadius: '10%',
              backgroundColor: row.tagColorHex ? row.tagColorHex : '',
            }}
          />
        ),
      },
      {
        columnName: 'action',
        sortingEnabled: false,
        align: 'center',
        render: (row) => {
          return (
            <Button
              size='sm'
              onClick={() => this.editRow(row)}
              justIcon
              color='primary'
            >
              <Edit />
            </Button>
          )
        },
      },
    ],
  }

  editRow = (row) => {
    const { dispatch, settingAppointmentType } = this.props
    dispatch({
      type: 'settingAppointmentType/updateState',
      payload: {
        showModal: true,
        entity: settingAppointmentType.list.find((o) => o.id === row.id),
      },
    })
  }

  render () {
    return (
      <CommonTableGrid
        type='settingAppointmentType'
        onRowDoubleClick={this.editRow}
        columns={columns}
        columnExtensions={this.state.columnExtensions}
      />
    )
  }
}

export default Grid
