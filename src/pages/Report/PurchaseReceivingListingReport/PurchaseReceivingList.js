import React, { PureComponent } from 'react'
import { ReportDataGrid } from '@/components/_medisys'

class PurchaseReceivingList extends PureComponent {
  handleExpandedGroupsChange = (expandedGroups) => {
    this.setState((prevState) => {
      return { ...prevState, tableGroupRows: expandedGroups }
    })
  }

  render () {
    let incomeData = []
    const { reportDatas } = this.props
    if (!reportDatas) return null
    if (reportDatas && reportDatas.PurchaseReceivingListingDetails) {
      incomeData = reportDatas.PurchaseReceivingListingDetails.map(
        (item, index) => ({
          ...item,
          id: `purchaseReceiving-${index}-${item.medicationCode}`,
        }),
      )
    }

    const PurchaseReceivingDetailsCols = [
      { name: 'transactionDate', title: 'Date' },
      { name: 'medicationCode', title: 'Code' },
      { name: 'medicationName', title: 'Name' },
      { name: 'transactionCategory', title: 'Transaction' },
      { name: 'transactionQuantity', title: 'Qty' },
      { name: 'uom', title: 'Uom' },
      { name: 'remark', title: 'Remarks' },
      { name: 'patientAccountNo', title: 'Acc. No.' },
      { name: 'patientName', title: 'Patient Name' },
    ]
    const PurchaseReceivingDetailsExtensions = [
      { columnName: 'transactionDate', type: 'date', sortingEnabled: false },
      {
        columnName: 'transactionQuantity',
        type: 'number',
        sortingEnabled: false,
      },
      { columnName: 'medicationCode', sortingEnabled: false },
      { columnName: 'medicationName', sortingEnabled: false },
      { columnName: 'transactionCategory', sortingEnabled: false },
      { columnName: 'uom', sortingEnabled: false },
      { columnName: 'remark', sortingEnabled: false },
      { columnName: 'patientAccountNo', sortingEnabled: false },
      { columnName: 'patientName', sortingEnabled: false },
    ]

    return (
      <ReportDataGrid
        data={incomeData}
        columns={PurchaseReceivingDetailsCols}
        columnExtensions={PurchaseReceivingDetailsExtensions}
      />
    )
  }
}
export default PurchaseReceivingList
