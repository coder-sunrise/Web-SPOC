import React, { PureComponent } from 'react'
import { IntegratedSummary } from '@devexpress/dx-react-grid'
import { Table } from '@devexpress/dx-react-grid-material-ui'
import { ReportDataGrid } from '@/components/_medisys'

class InventoryList extends PureComponent {
  render () {
    let listData = []
    const { reportDatas } = this.props
    if (!reportDatas) return null
    if (reportDatas.InventoryList) {
      listData = reportDatas.InventoryList.map((item, index) => ({
        ...item,
        id: `InventoryList-${index}-${item.inventoryType}`,
      }))
    }
    const SummaryRow = (p) => {
      const { children } = p
      let countCol = children.find((c) => {
        if (!c.props.tableColumn.column) return false
        return c.props.tableColumn.column.name === 'amount'
      })

      if (countCol) {
        const newChildren = [
          {
            ...countCol,
            props: {
              ...countCol.props,
              colSpan: 12,
              tableColumn: {
                ...countCol.props.tableColumn,
                align: 'right',
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
            { columnName: 'amount', type: 'sum' },
          ],
        },
        integrated: IntegratedSummary.defaultCalculator,
        row: {
          totalRowComponent: SummaryRow,
          messages: {
            sum: 'Grand Total',
          },
        },
      },
    }

    const InventoryListColumns = [
      { name: 'inventoryType', title: 'Type' },
      { name: 'inventoryCode', title: 'Code' },
      { name: 'inventoryItem', title: 'Item' },
      { name: 'supplier', title: 'Supplier' },
      { name: 'status', title: 'Status' },
      { name: 'stock', title: 'Stock' },
      { name: 'uom', title: 'UOM' },
      { name: 'sellingPrice', title: 'Selling Price' },
      { name: 'lcpBef', title: 'LCP (Before Bonus)' },
      { name: 'lcpAft', title: 'LCP (After Bonus)' },
      { name: 'acp', title: 'ACP' },
      { name: 'amount', title: 'Total Cost (ACP)' },
    ]
    const InventoryListExtensions = [
      { columnName: 'inventoryType', sortingEnabled: false, width: 120 },
      { columnName: 'inventoryCode', sortingEnabled: false, width: 150 },
      { columnName: 'inventoryItem', sortingEnabled: false },
      { columnName: 'supplier', sortingEnabled: false },
      { columnName: 'status', sortingEnabled: false, width: 80 },
      {
        columnName: 'stock',
        sortingEnabled: false,
        type: 'number',
        precision: 1,
        width: 100,
      },
      { columnName: 'uom', sortingEnabled: false, width: 130 },
      {
        columnName: 'sellingPrice',
        sortingEnabled: false,
        type: 'currency',
        currency: true,
        precision: 2,
        width: 130,
      },
      {
        columnName: 'lcpBef',
        sortingEnabled: false,
        type: 'currency',
        currency: true,
        precision: 4,
        width: 140,
      },
      {
        columnName: 'lcpAft',
        sortingEnabled: false,
        type: 'currency',
        currency: true,
        precision: 4,
        width: 140,
      },
      {
        columnName: 'acp',
        sortingEnabled: false,
        type: 'currency',
        currency: true,
        precision: 4,
        width: 140,
      },
      {
        columnName: 'amount',
        sortingEnabled: false,
        type: 'currency',
        currency: true,
        width: 160,
      },
    ]

    return (
      <ReportDataGrid
        data={listData}
        columns={InventoryListColumns}
        columnExtensions={InventoryListExtensions}
        FuncProps={FuncProps}
      />
    )
  }
}
export default InventoryList
