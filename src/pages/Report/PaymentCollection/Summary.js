import React from 'react'
// common components
import { ReportDataGrid } from '@/components/_medisys'

const Summary = ({ reportDatas }) => {
  if (!reportDatas)
    return null
  const { PaymentCollectionInfo: [sumDetail] } = reportDatas
  let sumData = []
  if (sumDetail) {
    sumData = [
      { id: '0', name: 'Total Payments:', value: sumDetail.totalPaymentCount.formatString() },
      { id: '2', name: 'Total Amount Collected:', value: sumDetail.totalCollectedAmount.currencyString() },
      { id: '4', name: 'Total Cash Rounding:', value: sumDetail.totalCashRounding.currencyString() },
    ]
    if (sumDetail.isDisplayGST) {
      sumData.splice(1, 0, { id: '2', name: 'Total Amount Collected before GST:', value: sumDetail.totalCollectedAmountBeforeGst.currencyString() })
      sumData.splice(3, 0, { id: '4', name: 'Total GST Collected:', value: sumDetail.totalCollectedGst.currencyString() })
    }
  }

  const sumExtensions = [
    { columnName: 'name', sortingEnabled: false, width: 300 },
    { columnName: 'value', sortingEnabled: false, width: 200, align: 'right' },
  ]
  const sumCols = [
    { name: 'name', title: 'Name' },
    { name: 'value', title: 'Value' },
  ]
  return (
    <ReportDataGrid
      style={{ width: 500, marginTop: 6 }}
      header={false}
      data={sumData}
      columns={sumCols}
      columnExtensions={sumExtensions}
    />
  )
}

export default Summary
