import React, { PureComponent } from 'react'
import { ReportDataGrid } from '@/components/_medisys'

class LowStockList extends PureComponent {
  render () {
    let listData = []
    const { reportDatas } = this.props
    if (!reportDatas)
      return null
    if (reportDatas && reportDatas.LowStockConsumablesDetails) {
      listData = reportDatas.LowStockConsumablesDetails.map(
        (item, index) => ({
          ...item,
          id: `LowStockConsumablesDetails-${index}-${item.code}`,
        }),
      )
    }

    const LowStockConsumablesDetailsCols = [
      { name: 'code', title: 'Code' },
      { name: 'name', title: 'Name' },
      { name: 'stock', title: 'Stock' },
      { name: 'threshold', title: 'Threshold' },
      { name: 'uom', title: 'UOM' },
      { name: 'supplier', title: 'Supplier' },
    ]
    const LowStockConsumablesDetailsExtensions = [
      { columnName: 'stock', type: 'number', sortingEnabled: false },
      { columnName: 'code', sortingEnabled: false },
      { columnName: 'name', sortingEnabled: false },
      { columnName: 'threshold', sortingEnabled: false },
      { columnName: 'uom', sortingEnabled: false },
      { columnName: 'supplier', sortingEnabled: false },
    ]

    return (
      <ReportDataGrid
        data={listData}
        columns={LowStockConsumablesDetailsCols}
        columnExtensions={LowStockConsumablesDetailsExtensions}
      />
    )
  }
}
export default LowStockList
