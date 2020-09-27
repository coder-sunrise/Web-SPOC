import React, { useMemo } from 'react'
// common components
import { IntegratedSummary } from '@devexpress/dx-react-grid'
import { GridItem, EditableTableGrid } from '@/components'

const PackageItemType = ({
  packageItemTypeProps,
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
        {...packageItemTypeProps}
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
    </GridItem>
  )
}
export default PackageItemType
