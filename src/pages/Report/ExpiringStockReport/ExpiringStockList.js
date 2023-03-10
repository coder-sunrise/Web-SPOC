import React, { PureComponent } from 'react'
import { IntegratedSummary } from '@devexpress/dx-react-grid'
import { Table } from '@devexpress/dx-react-grid-material-ui'
import { ReportDataGrid } from '@/components/_medisys'

class ExpiringStockList extends PureComponent {
  render () {
    let listData = []
    const { reportDatas } = this.props
    if (!reportDatas) return null
    if (reportDatas.ExpiryStockDetails) {
      listData = reportDatas.ExpiryStockDetails.map((item, index) => ({
        ...item,
        id: `ExpiringStockList-${index}`,
      }))
    }

    const SummaryRow = (p) => {
      const { children } = p
      let countCol = children.find((c) => {
        if (!c.props.tableColumn.column) return false
        return c.props.tableColumn.column.name === 'stock'
      })

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

    let FuncProps = {
      pager: false,
      summary: true,
      summaryConfig: {
        state: {
          totalItems: [ { columnName: 'stock', type: 'sum' } ],
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

    if (reportDatas.ListingDetails[0].groupByItem) {
      FuncProps = {
        ...FuncProps,
        summaryConfig: {
          state: {
            totalItems: [],
            groupItems: [
              {
                columnName: 'stock',
                type: 'sum',
              },
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
        grouping: true,
        groupingConfig: {
          state: {
            grouping: [ { columnName: 'name' } ],
          },
        },
      }
    }

    const ExpiringStockListColumns = [
      { name: 'stockType', title: 'Type' },
      { name: 'code', title: 'Code' },
      { name: 'name', title: 'Item' },
      { name: 'batchNo', title: 'Batch No' },
      { name: 'expiryDate', title: 'Expiry Date' },
      { name: 'supplier', title: 'Supplier' },
      { name: 'isDefault', title: 'Is Default' },
      { name: 'stock', title: 'Stock' },
    ]

    const ExpiringStockListExtensions = [
      { columnName: 'stockType', sortingEnabled: false },
      { columnName: 'code', sortingEnabled: false },
      { columnName: 'name', sortingEnabled: false },
      { columnName: 'batchNo', sortingEnabled: false },
      { columnName: 'expiryDate', type: 'date', sortingEnabled: false },
      { columnName: 'supplier', sortingEnabled: false },
      { columnName: 'isDefault', sortingEnabled: false },
      { columnName: 'stock', sortingEnabled: false, type: 'number', precision: 1 },
    ]

    return (
      <ReportDataGrid
        data={listData}
        columns={ExpiringStockListColumns}
        columnExtensions={ExpiringStockListExtensions}
        FuncProps={FuncProps}
      />
    )
  }
}

export default ExpiringStockList
