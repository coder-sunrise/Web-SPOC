import React from 'react'
import {
  IntegratedSummary,
} from '@devexpress/dx-react-grid'
import { ReportDataGrid } from '@/components/_medisys'


const PastPaymentsCollection = ({ reportDatas, isCompany }) => {
  if (!reportDatas)
    return null
  let listData = []
  const { PrivatePastInvoicePaymentDetails, CompanyPastInvoicePaymentDetails } = reportDatas
  if (!isCompany && PrivatePastInvoicePaymentDetails) {
    listData = PrivatePastInvoicePaymentDetails.map(
      (item, index) => ({
        ...item,
        id: `PrivatePastInvoicePaymentDetails-${index}-${item.invoiceNo}`,
      }),
    )
  }
  else if (CompanyPastInvoicePaymentDetails && isCompany) {
    listData = CompanyPastInvoicePaymentDetails.map(
      (item, index) => ({
        ...item,
        id: `CompanyPastInvoicePaymentDetails-${index}-${item.invoiceNo}`,
      }),
    )
  }

  let invoiceNoTitle = 'Invoice No.'
  let payerNameTitle = 'Payer Name'
  let doctorNameTitle = 'Optometrist'
  let invoiceDateTitle = 'Invoice Date'
  if (isCompany) {
    invoiceNoTitle = 'Statement No. / Invoice No.'
    payerNameTitle = 'Payer Code'
    doctorNameTitle = 'Payer Name'
    invoiceDateTitle = 'Statement Date / Invoice Date'
  }

  const PastPaymentCollectionTableColumn = [
    { name: 'payerName', title: payerNameTitle },
    { name: 'doctorName', title: doctorNameTitle },
    { name: 'invoiceDate', title: invoiceDateTitle },
    { name: 'invoiceNo', title: invoiceNoTitle },
    { name: 'mode', title: 'Payment Mode' },
    { name: 'amt', title: 'Payment Amt.' },
    { name: 'paymentReceivedDate', title: 'Payment Received Date' },
  ]

  const PastPaymentCollectionTableColumnExtension = [
    { columnName: 'payerName', sortingEnabled: false },
    { columnName: 'doctorName', sortingEnabled: false },
    { columnName: 'invoiceNo', sortingEnabled: false },
    { columnName: 'invoiceDate', sortingEnabled: false },
    { columnName: 'mode', sortingEnabled: false },
    { columnName: 'paymentReceivedDate', sortingEnabled: false },                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             
    { columnName: 'amt', type: 'currency', currency: true, sortingEnabled: false },
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
