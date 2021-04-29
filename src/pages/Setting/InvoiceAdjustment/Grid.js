import React, { PureComponent } from 'react'

import Edit from '@material-ui/icons/Edit'
import { status } from '@/utils/codes'
import { CommonTableGrid, Button, Tooltip, NumberInput } from '@/components'
import numeral from 'numeral'

const amountProps = {
  style: { margin: 0, fontWeight: 500, color: 'darkblue' },
  noUnderline: true,
  currency: true,
  disabled: true,
  rightAlign: true,
  normalText: true,
  showZero: true,
  text: true,
  fullWidth: true,
}

class Grid extends PureComponent {
  configs = {
    columns: [
      { name: 'code', title: 'Code' },
      { name: 'displayValue', title: 'Display Value' },
      { name: 'description', title: 'Remarks' },
      { name: 'adjustment', title: 'Adjustment' },
      { name: 'sortOrder', title: 'Sort Order' },
      { name: 'isActive', title: 'Status' },
      {
        name: 'action',
        title: 'Action',
      },
    ],
    columnExtensions: [
      { columnName: 'code', width: 200 },
      { columnName: 'sortOrder', width: 110 },
      { columnName: 'displayValue', width: 300 },
      {
        columnName: 'adjustment',
        width: 150,
        align: 'right',
        sortingEnabled: false,
        render: (row) => {
          if (row.adjType === 'ExactAmount')
            return <NumberInput {...amountProps} value={row.adjValue} />
          if (row.adjValue > 0)
            return (
              <span style={{ display: 'inline-block' }}>
                <span
                  style={{
                    fontWeight: '500',
                    color: 'darkblue',
                    fontSize: '14px',
                  }}
                >
                  {numeral(row.adjValue).format('0.00')}%
                </span>
              </span>
            )

          return (
            <div
              style={{ color: 'red', fontWeight: '500', textAlign: 'right' }}
            >
              <span>({numeral(Math.abs(row.adjValue)).format('0.00')}%)</span>
            </div>
          )
        },
      },
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
            <Tooltip title='Edit Invoice Adjustment'>
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
    const { dispatch, settingInvoiceAdjustment } = this.props
    const { list } = settingInvoiceAdjustment
    dispatch({
      type: 'settingInvoiceAdjustment/updateState',
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
        style={{ margin: 0 }}
        forceRender
        type='settingInvoiceAdjustment'
        onRowDoubleClick={this.editRow}
        TableProps={{
          height,
        }}
        {...this.configs}
      />
    )
  }
}

export default Grid
