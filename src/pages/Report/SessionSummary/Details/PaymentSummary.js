import React from 'react'
import {
  IntegratedSummary,
} from '@devexpress/dx-react-grid'
import { ReportDataGrid } from '@/components/_medisys'


const PaymentSummary = ({ PaymentSummaryDetails }) => {
  if (!PaymentSummaryDetails)
    return null
  let listData = []
  if (PaymentSummaryDetails) {
    listData = PaymentSummaryDetails.map((item) => ({
      ...item,
      id: `paymentDetails-${item.paymentMode}`,
      subTotal: item.currentCollected + item.pastCollected,
    })
    )
  }

  const PaymentDetailsColumns = [
    { name: 'paymentMode', title: 'Payment Mode' },
    { name: 'currentCollected', title: 'This Session' },
    { name: 'pastCollected', title: 'Past Session' },
    { name: 'subTotal', title: 'Sub Total' },
  ]
  const PaymentDetailsColumnsExtensions = [
    { columnName: 'currentCollected', type: 'currency', currency: true },
    { columnName: 'pastCollected', type: 'currency', currency: true },
    { columnName: 'subTotal', type: 'currency', currency: true },
  ]
  const FuncProps = {
    pager: false,
    summary: true,
    summaryConfig: {
      state: {
        totalItems: [
          { columnName: 'currentCollected', type: 'sum' },
          { columnName: 'pastCollected', type: 'sum' },
          { columnName: 'subTotal', type: 'sum' },
        ],
      },
      integrated: {
        calculator: IntegratedSummary.defaultCalculator,
      },
      row: {
        messages: {
          sum: 'Total',
        },
      },
    },
  }
  return (
    <ReportDataGrid
      data={listData}
      columns={PaymentDetailsColumns}
      columnExtensions={PaymentDetailsColumnsExtensions}
      FuncProps={FuncProps}
    />
  )
}

export default PaymentSummary
