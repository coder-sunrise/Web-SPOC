import React from 'react'
// common components
import { NumberInput } from '@/components'
import { ReportDataGrid } from '@/components/_medisys'

const Summary = ({ reportDatas }) => {
  if (!reportDatas) return null
  const {
    PaymentCollectionInfo: [
      sumDetail,
    ],
  } = reportDatas
  let sumData = []
  if (sumDetail) {
    sumData = [
      {
        id: '1',
        isCurrency: true,
        name: 'Total Amount Collected:',
        value: sumDetail.totalCollectedAmount,
      },
      {
        id: '3',
        isCurrency: true,
        name: 'Total Cash Rounding:',
        value: sumDetail.totalCashRounding,
      },
    ]
    if (sumDetail.isDisplayGST) {
      sumData.splice(0, 0, {
        id: '0',
        name: 'Total Amount Collected before GST:',
        isCurrency: true,
        value: sumDetail.totalCollectedAmountBeforeGst,
      })
      sumData.splice(2, 0, {
        id: '2',
        name: 'Total GST Collected:',
        isCurrency: true,
        value: sumDetail.totalCollectedGst,
      })
    }
  }

  const sumExtensions = [
    { columnName: 'name', sortingEnabled: false, width: 300 },
    {
      columnName: 'value',
      sortingEnabled: false,
      width: 200,
      align: 'right',
      render: (row) => (
        <NumberInput currency={row.isCurrency} text value={row.value} />
      ),
    },
  ]
  const sumCols = [
    { name: 'name', title: 'Name' },
    { name: 'value', title: 'Value' },
  ]
  return (
    <ReportDataGrid
      style={{ width: 500, marginTop: 6 }}
      noHeight
      header={false}
      data={sumData}
      columns={sumCols}
      columnExtensions={sumExtensions}
      flexible
    />
  )
}

export default Summary
