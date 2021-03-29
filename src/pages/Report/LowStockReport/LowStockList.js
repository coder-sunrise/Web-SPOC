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
      { name: 'stock', title: 'Current Stock' },
      { name: 'threshold', title: 'Threshold' },
      { name: 'uom', title: 'UOM' },
      { name: 'supplier', title: 'Supplier' },
    ]
    const LowStockDetailsExtensions = [
      { columnName: 'inventoryType', sortingEnabled: false },
      { columnName: 'stock', type: 'number', sortingEnabled: false },
      { columnName: 'code', sortingEnabled: false },
      { columnName: 'name', sortingEnabled: false },
      { columnName: 'threshold', type: 'number', sortingEnabled: false },
      { columnName: 'uom', sortingEnabled: false },
      { columnName: 'supplier', sortingEnabled: false },
    ]

    return <ReportDataGrid data={listData} columns={LowStockDetailsCols} columnExtensions={LowStockDetailsExtensions} />
  }
}
export default LowStockList
