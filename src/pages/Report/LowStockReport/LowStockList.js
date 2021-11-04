import React, { PureComponent } from 'react'
import { ReportDataGrid } from '@/components/_medisys'

class LowStockList extends PureComponent {
  render () {
    let listData = []
    const { reportDatas } = this.props
    if (!reportDatas) return null
    if (reportDatas && reportDatas.LowStockDetails) {
      listData = reportDatas.LowStockDetails.map((item, index) => ({
        ...item,
        id: `LowStockDetails-${index}-${item.code}`,
      }))
    }

    const LowStockDetailsCols = [
      { name: 'inventoryType', title: 'Inventory Type' },
      { name: 'code', title: 'Code' },
      { name: 'name', title: 'Name' },
      { name: 'thresholdType', title: 'Threshold Type' },
      { name: 'stock', title: 'Current Stock' },
      { name: 'threshold', title: 'Threshold' },
      { name: 'uom', title: 'UOM' },
      { name: 'status', title: 'Status' },
      { name: 'supplier', title: 'Supplier' },
    ]
    const LowStockDetailsExtensions = [
      { columnName: 'inventoryType', width: '120', sortingEnabled: false },
      {
        columnName: 'stock',
        width: '120',
        type: 'number',
        sortingEnabled: false,
      },
      { columnName: 'code', width: '150', sortingEnabled: false },
      { columnName: 'name', sortingEnabled: false },
      { columnName: 'thresholdType', width: 120, sortingEnabled: false },
      {
        columnName: 'threshold',
        width: '120',
        type: 'number',
        sortingEnabled: false,
      },
      { columnName: 'uom', width: '110', sortingEnabled: false },
      { columnName: 'status', width: '80', sortingEnabled: false },
      { columnName: 'supplier', width: '200', sortingEnabled: false },
    ]

    return <ReportDataGrid data={listData} columns={LowStockDetailsCols} columnExtensions={LowStockDetailsExtensions} />
  }
}
export default LowStockList
