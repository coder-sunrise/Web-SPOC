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
      { name: 'paymentCharges', title: 'Payment Charges' },
      { name: 'hotKey', title: 'Shortcut Key' },
      { name: 'isActive', title: 'Status' },
      {
        name: 'action',
        title: 'Action',
      },
    ],
    columnExtensions: [
      {
        columnName: 'paymentCharges',
        // type: 'number',
        width: 200,
      },
      {
        columnName: 'hotKey',
        align: 'center',
        width: 120,
      },
      {
        columnName: 'isActive',
        sortingEnabled: false,
        type: 'select',
        options: status,
        width: 120,
        align: 'center',
      },
      {
        columnName: 'action',
        align: 'center',
        render: (row) => {
          return (
            <Tooltip title='Edit Payment Mode' placement='bottom'>
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
    ],
  }

  editRow = (row, e) => {
    const { dispatch, settingPaymentMode } = this.props

    const { list } = settingPaymentMode

    dispatch({
      type: 'settingPaymentMode/updateState',
      payload: {
        showModal: true,
        entity: list.find((o) => o.id === row.id),
      },
    })
  }

  render () {
    const { dispatch, classes, settingPaymentMode, toggleModal } = this.props
    return (
      <CommonTableGrid
        style={{ margin: 0 }}
        type='settingPaymentMode'
        onRowDoubleClick={this.editRow}
        {...this.configs}
      />
    )
  }
}

export default Grid
