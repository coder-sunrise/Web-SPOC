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
    if (!reportDatas) return null
    if (reportDatas && reportDatas.InventoryStockDetails) {
      incomeData = reportDatas.InventoryStockDetails.map((item, index) => ({
        ...item,
        id: `inventoryMovement-${index}-${item.InventoryCode}`,
      }))
    }

    const InventoryStockDetailsCols = [
      { name: 'inventoryType', title: 'Inventory Type' },
      { name: 'transactionDate', title: 'Date' },
      { name: 'inventoryCode', title: 'Code' },
      { name: 'inventoryName', title: 'Name' },
      { name: 'transactionCategory', title: 'Transaction' },
      { name: 'transactionQuantity', title: 'Qty' },
      { name: 'uom', title: 'UOM' },
      { name: 'remark', title: 'Remarks' },
      { name: 'patientAccountNo', title: 'Acc. No.' },
      { name: 'patientName', title: 'Patient Name' },
    ]
    const InventoryStockDetailsExtensions = [
      { columnName: 'inventoryType', sortingEnabled: false },
      { columnName: 'transactionDate', type: 'date', sortingEnabled: false },
      {
        columnName: 'transactionQuantity',
        type: 'number',
        sortingEnabled: false,
      },
      { columnName: 'inventoryCode', sortingEnabled: false },
      { columnName: 'inventoryName', sortingEnabled: false },
      { columnName: 'transactionCategory', sortingEnabled: false },
      { columnName: 'uom', sortingEnabled: false },
      { columnName: 'remark', sortingEnabled: false },
      { columnName: 'patientAccountNo', sortingEnabled: false },
      { columnName: 'patientName', sortingEnabled: false },
    ]

    return (
      <ReportDataGrid
        data={incomeData}
        columns={InventoryStockDetailsCols}
        columnExtensions={InventoryStockDetailsExtensions}
      />
    )
  }
}
export default MovementList
