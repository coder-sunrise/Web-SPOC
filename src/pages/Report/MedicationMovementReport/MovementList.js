import React, { PureComponent } from 'react'
import { ReportDataGrid } from '@/components/_medisys'

class MovementList extends PureComponent {

  handleExpandedGroupsChange = (expandedGroups) => {
    this.setState((prevState) => {
      return { ...prevState, tableGroupRows: expandedGroups }
    })
  }

  render () {
    let incomeData = []
    const { reportDatas } = this.props
    if (!reportDatas)
      return null
    if (reportDatas && reportDatas.MedicationStockDetails) {
      incomeData = reportDatas.MedicationStockDetails.map(
        (item, index) => ({
          ...item,
          id: `medicationMovement-${index}-${item.medicationCode}`,
        }),
      )
    }

    const MedicationStockDetailsCols = [
      { name: 'transactionDate', title: 'Date' },
      { name: 'medicationCode', title: 'Code' },
      { name: 'medicationName', title: 'Name' },
      { name: 'transactionCategory', title: 'Transaction' },
      { name: 'transactionQuantity', title: 'QTY' },
      { name: 'uom', title: 'UOM' },
      { name: 'remark', title: 'Remarks' },
      { name: 'patientAccountNo', title: 'Acc. No.' },
      { name: 'patientName', title: 'Patient Name' },
    ]
    const MedicationStockDetailsExtensions = [
      { columnName: 'transactionDate', type: 'date' },
      { columnName: 'transactionQuantity', type: 'number' },
    ]

    return (
      <ReportDataGrid
        data={incomeData}
        columns={MedicationStockDetailsCols}
        columnExtensions={MedicationStockDetailsExtensions}
      />
    )
  }
}
export default MovementList
