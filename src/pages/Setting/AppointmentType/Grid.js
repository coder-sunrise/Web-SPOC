import React from 'react'
// material ui
import Edit from '@material-ui/icons/Edit'
// common component
import { CommonTableGrid, Button, Tooltip } from '@/components'
// utils
import { status } from '@/utils/codes'
import { Tag } from 'antd'

const columns = [
  { name: 'code', title: 'Code' },
  { name: 'displayValue', title: 'Display Value' },
  { name: 'tagColorHex', title: 'Appt. Type Color' },
  { name: 'sortOrder', title: 'Sort Order' },
  // { name: 'isDefault', title: 'Default' },
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
        columnName: 'code',
        width: 300,
        sortingEnabled: true,
        render: row => {
          let width = row.isDefault ? 228 : 290
          return (
            <Tooltip title={row.code} placement='bottom'>
              <div style={{ position: 'relative', top: '3px' }}>
                <div
                  style={{
                    display: 'inline-block',
                    width: width,
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {row.code}
                </div>
                {row.isDefault ? (
                  <span style={{ position: 'relative', top: '-5px' }}>
                    <Tag color='#008000'>Default</Tag>
                  </span>
                ) : (
                  <span></span>
                )}
              </div>
            </Tooltip>
          )
        },
      },
      {
        columnName:'sortOrder',
        sortingEnabled: true,
        width:'100px',
      },
      // {
      //   columnName:'isDefault',
      //   sortingEnabled: false,
      //   align: 'center',
      //   width:'100px',
      //   render: row => (row.isDefault ? 'Yes' : 'No'),
      // },
      {
        columnName: 'isActive',
        sortingEnabled: false,
        type: 'select',
        options: status,
        width:'100px',
      },
      {
        columnName: 'tagColorHex',
        width: '200px',
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
        render: (row) => (
          <Tooltip title='Edit Appointment Type'>
            <Button
              size='sm'
              onClick={() => this.editRow(row)}
              justIcon
              color='primary'
            >
              <Edit />
            </Button>
          </Tooltip>
        ),
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
    const { height } = this.props
    return (
      <CommonTableGrid
        type='settingAppointmentType'
        onRowDoubleClick={this.editRow}
        columns={columns}
        forceRender
        columnExtensions={this.state.columnExtensions}
        TableProps={{
          height,
        }}
      />
    )
  }
}

export default Grid
