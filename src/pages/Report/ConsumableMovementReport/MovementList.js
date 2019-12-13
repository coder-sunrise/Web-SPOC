import React, { PureComponent } from 'react'
import { ReportDataGrid } from '@/components/_medisys'

class MovementList extends PureComponent {
  render () {
    let incomeData = []
    const { reportDatas } = this.props
    if (!reportDatas) return null
    if (reportDatas && reportDatas.ConsumableStockDetails) {
      incomeData = reportDatas.ConsumableStockDetails.map((item, index) => ({
        ...item,
        id: `ConsumableMovement-${index}-${item.consumableCode}`,
      }))
    }

    const ConsumableStockDetailsCols = [
      { name: 'transactionDate', title: 'Date' },
      { name: 'consumableCode', title: 'Code' },
      { name: 'consumableName', title: 'Name' },
      { name: 'transactionCategory', title: 'Transaction' },
      { name: 'transactionQuantity', title: 'Qty' },
      { name: 'uom', title: 'Uom' },
      { name: 'remark', title: 'Remarks' },
      { name: 'patientAccountNo', title: 'Acc. No.' },
      { name: 'patientName', title: 'Patient Name' },
    ]
    const ConsumableStockDetailsExtensions = [
      { columnName: 'transactionDate', type: 'date', sortingEnabled: false },
      {
        columnName: 'transactionQuantity',
        type: 'number',
        sortingEnabled: false,
      },
      { columnName: 'consumableCode', sortingEnabled: false },
      { columnName: 'consumableName', sortingEnabled: false },
      { columnName: 'transactionCategory', sortingEnabled: false },
      { columnName: 'uom', sortingEnabled: false },
      { columnName: 'remark', sortingEnabled: false },
      { columnName: 'patientAccountNo', sortingEnabled: false },
      { columnName: 'patientName', sortingEnabled: false },
    ]

    return (
      <ReportDataGrid
        data={incomeData}
        columns={ConsumableStockDetailsCols}
        columnExtensions={ConsumableStockDetailsExtensions}
      />
    )
  }
}
export default MovementList
