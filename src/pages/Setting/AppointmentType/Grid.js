import React from 'react'
// material ui
import Edit from '@material-ui/icons/Edit'
// common component
import { CommonTableGrid, Button, Tooltip } from '@/components'
// utils
import { status } from '@/utils/codes'

const columns = [
  { name: 'code', title: 'Code' },
  { name: 'displayValue', title: 'Display Value' },
  { name: 'tagColorHex', title: 'Appt. Type Color' },
  { name: 'isActive', title: 'Status' },
  { name: 'sortOrder', title: 'Sort Order' },
  { name: 'isDefault', title: 'Default' },
  {
    name: 'action',
    title: 'Action',
  },
]

class Grid extends React.PureComponent {
  state = {
    columnExtensions: [
      {
        columnName:'sortOrder',
        sortingEnabled: true,
        width:'100px',
      },
      {
        columnName:'isDefault',
        sortingEnabled: false,
        type: 'radio',
        align: 'center',
        width:'100px',
        checkedValue: true,
        uncheckedValue: false,
        onChange: ({ row, checked }) => {
          // if (checked) {
          //   const { values, setFieldValue, setFieldTouched } = this.props
          //   const serviceSettingItem = _.cloneDeep(
          //     values.ctServiceCenter_ServiceNavigation,
          //   )
          //   serviceSettingItem.forEach(pec => {
          //     pec.isDefault = false
          //   })
          //   const r = serviceSettingItem.find(o => o.id === row.id)
          //   if (r) {
          //     r.isDefault = true
          //   }
          //   this.setState({ serviceSettings: serviceSettingItem })
          //   setFieldValue('ctServiceCenter_ServiceNavigation',serviceSettingItem)
          //   setFieldTouched('ctServiceCenter_ServiceNavigation', true)
          // }
        },
      },
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
        columnExtensions={this.state.columnExtensions}
        TableProps={{
          height,
        }}
      />
    )
  }
}

export default Grid
