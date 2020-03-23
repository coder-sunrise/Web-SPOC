import React, { PureComponent } from 'react'
import { IntegratedSummary } from '@devexpress/dx-react-grid'
import { Table } from '@devexpress/dx-react-grid-material-ui'
import { ReportDataGrid } from '@/components/_medisys'

class InventoryStockCountList extends PureComponent {
  render () {
    let listData = []
    const { reportDatas } = this.props
    if (!reportDatas) return null
    if (reportDatas.InventoryStockCountList) {
      listData = reportDatas.InventoryStockCountList.map((item, index) => ({
        ...item,
        id: `InventoryStockCountList-${index}-${item.inventoryType}`,
      }))
    }
    const SummaryRow = (p) => {
      const { children } = p
      let countCol = children.find((c) => {
        if (!c.props.tableColumn.column) return false
        return c.props.tableColumn.column.name === 'stock'
      })
      // console.log({ countCol })

      if (countCol) {
        const newChildren = [
          {
            ...countCol,
            props: {
              ...countCol.props,
              colSpan: 8,
              tableColumn: {
                ...countCol.props.tableColumn,
                align: 'left',
              },
            },
            key: 1111,
          },
        ]
        return <Table.Row {...p}>{newChildren}</Table.Row>
      }
      return <Table.Row {...p}>{children}</Table.Row>
    }
    const FuncProps = {
      pager: false,
      summary: true,
      summaryConfig: {
        state: {
          totalItems: [
            { columnName: 'stock', type: 'sum' },
          ],
        },
        integrated: IntegratedSummary.defaultCalculator,
        row: {
          totalRowComponent: SummaryRow,
          messages: {
            sum: 'Total Number of Stock',
          },
        },
      },
    }

    const InventoryStockCountListColumns = [
      { name: 'inventoryType', title: 'Type' },
      { name: 'inventoryCode', title: 'Code' },
      { name: 'inventoryItem', title: 'Item' },
      { name: 'status', title: 'Status' },
      { name: 'expiryDate', title: 'Expiry Date' },
      { name: 'batchNo', title: 'Latest Batch No' },
      { name: 'uom', title: 'UOM' },
      { name: 'stock', title: 'Stock' },
    ]
    const InventoryStockCountListExtensions = [
      { columnName: 'inventoryType', sortingEnabled: false },
      { columnName: 'inventoryCode', sortingEnabled: false },
      { columnName: 'inventoryItem', sortingEnabled: false },
      { columnName: 'status', sortingEnabled: false },
      { columnName: 'expiryDate', sortingEnabled: false, type: 'date' },
      { columnName: 'batchNo', sortingEnabled: false },
      { columnName: 'uom', sortingEnabled: false },
      {
        columnName: 'stock',
        sortingEnabled: false,
        type: 'number',
        precision: 1,
      },
    ]

    return (
      <ReportDataGrid
        data={listData}
        columns={InventoryStockCountListColumns}
        columnExtensions={InventoryStockCountListExtensions}
        FuncProps={FuncProps}
      />
    )
  }
}
export default InventoryStockCountList
