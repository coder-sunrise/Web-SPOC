import React, { useMemo } from 'react'
// common components
import { IntegratedSummary } from '@devexpress/dx-react-grid'
import { GridItem, EditableTableGrid, NumberInput } from '@/components'

const InventoryType = ({
  inventoryTypeProps,
  schema,
  rows,
  editingProps,
  title,
  style,
}) => {
  const subtotal = useMemo(
    () =>
      rows.reduce(
        (total, row) => (row.subTotal ? total + row.subTotal : total),
        0,
      ),
    [
      rows,
    ],
  )
  return (
    <GridItem xs={12} style={{ position: 'relative' }}>
      <h4 style={style}>
        <b>{title}</b>
      </h4>
      <EditableTableGrid
        {...inventoryTypeProps}
        schema={schema}
        rows={rows}
        forceRender
        onRowDoubleClick={undefined}
        FuncProps={{
          pager: false,
          summary: true,
          summaryConfig: {
            state: {
              totalItems: [
                { columnName: 'subTotal', type: 'sum' },
              ],
            },
            integrated: {
              calculator: IntegratedSummary.defaultCalculator,
            },
            row: {
              messages: {
                sum: 'Total',
              },
            },
          },
        }}
        EditingProps={{ ...editingProps }}
      />
      {/* <div
        style={{
          position: 'absolute',
          width: 150,
          bottom: 16,
          right: 91,
          textAlign: 'right',
        }}
      >
        <span style={{ fontSize: '1em', fontWeight: 500 }}>
          Sub Total:&nbsp;
        </span>
        <NumberInput text currency value={subtotal} />
      </div> */}
    </GridItem>
  )
}
export default InventoryType
