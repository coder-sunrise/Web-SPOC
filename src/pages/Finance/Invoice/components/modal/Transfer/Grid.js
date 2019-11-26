import React from 'react'
import { CommonTableGrid, NumberInput, GridItem, FastField } from '@/components'

const tableParams = {
  columns: [
    { name: 'type', title: 'Type' },
    { name: 'name', title: 'Name' },
    { name: 'total', title: 'Total ($)' },
    { name: 'transfer', title: 'Transfer ($)' },
  ],
  columnExtensions: [
    {
      columnName: 'total',
      type: 'number',
      currency: true,
    },
    {
      columnName: 'transfer',
      type: 'number',
      currency: true,
      render: (row) => {
        return (
          <GridItem xs={8}>
            <FastField
              name={`statementInvoice[${row.rowIndex}].total`}
              render={(args) => (
                <NumberInput
                  {...args}
                  currency
                  min={0}
                  onChange={(e) => this.handlePaymentAmount(e, 'grid')}
                />
              )}
            />
          </GridItem>
        )
      },
    },
  ],
}

const Grid = () => {
  return (
    <CommonTableGrid
      {...tableParams}
      FuncProps={{
        pager: false,
        selectable: true,
        selectConfig: {
          showSelectAll: true,
          rowSelectionEnabled: (row) => {
            return true
          },
        },
      }}
    />
  )
}

export default Grid
