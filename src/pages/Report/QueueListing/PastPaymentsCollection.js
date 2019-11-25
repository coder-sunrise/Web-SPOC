import React from 'react'
import {
  IntegratedSummary,
} from '@devexpress/dx-react-grid'
import moment from 'moment'
import {
  dateFormatLong,
} from '@/components'
import { ReportDataGrid } from '@/components/_medisys'


const PastPaymentsCollection = ({ reportDatas }) => {
  if (!reportDatas)
    return null
  let listData = []
  const { PastInvoicePaymentDetails } = reportDatas
  if (PastInvoicePaymentDetails) {
    listData = PastInvoicePaymentDetails.map(
      (item, index) => ({
        ...item,
        id: `PastInvoicePaymentDetails-${index}-${item.invoiceNo}`,
      }),
    )
  }

  const PastPaymentCollectionTableColumn = [
    { name: 'payerName', title: 'Payer Name' },
    { name: 'doctorName', title: 'Doctor' },
    { name: 'invoiceNo', title: 'Invoice No' },
    { name: 'invoiceDate', title: 'Invoice Date' },
    { name: 'mode', title: 'Payment Mode' },
    { name: 'amt', title: 'Invoice Amt' },
    { name: 'paymentReceivedDate', title: 'Payment Received Date' },
  ]

  const PastPaymentCollectionTableColumnExtension = [
    { columnName: 'amt', type: 'currency', currency: true },
  ]

  const FuncProps = {
    pager: false,
    grouping: true,
    groupingConfig: {
      state: {
        grouping: [
          { columnName: 'paymentReceivedDate' },
        ],
      },
    },
    summary: true,
    summaryConfig: {
      state: {
        totalItems: [],
        groupItems: [{ columnName: 'amt', type: 'sum' }],
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
      columns={PastPaymentCollectionTableColumn}
      columnExtensions={PastPaymentCollectionTableColumnExtension}
      FuncProps={FuncProps}
    />
  )
}

export default PastPaymentsCollection
