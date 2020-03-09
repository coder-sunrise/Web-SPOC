import React, { useMemo } from 'react'
// common components
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
        onRowDoubleClick={undefined}
        FuncProps={{
          pager: false,
        }}
        EditingProps={{ ...editingProps }}
      />
      <div
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
      </div>
    </GridItem>
  )
}
export default InventoryType
