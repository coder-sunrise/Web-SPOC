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
      { name: 'transactionQuantity', title: 'QTY' },
      { name: 'uom', title: 'UOM' },
      { name: 'remark', title: 'Remarks' },
      { name: 'patientAccountNo', title: 'Acc. No.' },
      { name: 'patientName', title: 'Patient Name' },
    ]
    const ConsumableStockDetailsExtensions = [
      { columnName: 'transactionDate', type: 'date' },
      { columnName: 'transactionQuantity', type: 'qty' },
    ]

    return (
      <ReportDataGrid
        height={500}
        data={incomeData}
        columns={ConsumableStockDetailsCols}
        columnExtensions={ConsumableStockDetailsExtensions}
      />
    )
  }
}
export default MovementList
