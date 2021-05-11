import React, { PureComponent } from 'react'
import { ReportDataGrid } from '@/components/_medisys'
import {
  NumberInput,
} from '@/components'

class MovementList extends PureComponent {
  handleExpandedGroupsChange = (expandedGroups) => {
    this.setState((prevState) => {
      return { ...prevState, tableGroupRows: expandedGroups }
    })
  }

  render() {
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
      { name: 'inventoryType', title: 'Type' },
      { name: 'transactionDate', title: 'Date' },
      { name: 'inventoryCode', title: 'Code' },
      { name: 'inventoryName', title: 'Name' },
      { name: 'transactionCategory', title: 'Transaction' },
      { name: 'costPrice', title: 'Cost Price' },
      { name: 'transactionQuantity', title: 'Qty.' },
      { name: 'uom', title: 'UOM' },
      { name: 'remark', title: 'Remarks' },
      { name: 'patientAccountNo', title: 'Acc. No.' },
      { name: 'patientName', title: 'Patient Name' },
    ]
    const InventoryStockDetailsExtensions = [
      { columnName: 'inventoryType', sortingEnabled: false, width: 120 },
      { columnName: 'transactionDate', type: 'date', sortingEnabled: false, width: 100 },
      {
        columnName: 'transactionQuantity',
        type: 'number',
        sortingEnabled: false, width: 80
      },
      { columnName: 'inventoryCode', sortingEnabled: false, width: 110 },
      { columnName: 'inventoryName', sortingEnabled: false },
      { columnName: 'transactionCategory', sortingEnabled: false, width: 150 },
      { columnName: 'uom', sortingEnabled: false, width: 100 },
      { columnName: 'remark', sortingEnabled: false, width: 150 },
      { columnName: 'patientAccountNo', sortingEnabled: false, width: 110 },
      { columnName: 'patientName', sortingEnabled: false },
      {
        columnName: 'costPrice', type: 'currency', currency: true, sortingEnabled: false, width: 100,
        render: (row) => {
          return row.costPrice ? <NumberInput text currency value={row.costPrice} /> : ''
        }
      },
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
