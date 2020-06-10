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
        return c.props.tableColumn.column.name === 'stock'
      })
      // console.log({ countCol })

      if (countCol) {
        const newChildren = [
          {
            ...countCol,
            props: {
              ...countCol.props,
              colSpan: 9,
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

    const InventoryListColumns = [
      { name: 'inventoryType', title: 'Type' },
      { name: 'inventoryCode', title: 'Code' },
      { name: 'inventoryItem', title: 'Item' },
      { name: 'supplier', title: 'Supplier' },
      { name: 'status', title: 'Status' },
      { name: 'stock', title: 'Stock' },
      { name: 'uom', title: 'UOM' },
      { name: 'acp', title: 'ACP' },
      { name: 'amount', title: 'Amount' },
    ]
    const InventoryListExtensions = [
      { columnName: 'inventoryType', sortingEnabled: false },
      { columnName: 'inventoryCode', sortingEnabled: false },
      { columnName: 'inventoryItem', sortingEnabled: false },
      { columnName: 'supplier', sortingEnabled: false },
      { columnName: 'status', sortingEnabled: false },
      {
        columnName: 'stock',
        sortingEnabled: false,
        type: 'number',
        precision: 1,
      },
      { columnName: 'uom', sortingEnabled: false, align: 'right' },
      {
        columnName: 'acp',
        sortingEnabled: false,
        type: 'currency',
        currency: true,
      },
      {
        columnName: 'amount',
        sortingEnabled: false,
        type: 'currency',
        currency: true,
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
