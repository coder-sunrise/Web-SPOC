import React from 'react'
import { GridItem, EditableTableGrid } from '@/components'

const InventoryType = ({
  inventoryTypeProps,
  schema,
  rows,
  editingProps,
  title,
  style,
}) => {
  return (
    <GridItem xs={12}>
      <h4 style={style}>
        <b>{title}</b>
      </h4>
      <EditableTableGrid
        {...inventoryTypeProps}
        schema={schema}
        rows={rows}
        onRowDoubleClick={undefined}
        FuncProps={{ pager: false }}
        EditingProps={{ ...editingProps }}
      />
    </GridItem>
  )
}
export default InventoryType
