import React from 'react'
import {
  IntegratedSummary,
} from '@devexpress/dx-react-grid'
import {
  Table,
} from '@devexpress/dx-react-grid-material-ui'
import { ReportDataGrid } from '@/components/_medisys'


const PaymentCollections = ({ PaymentCollectionsDetails, TotalDetails }) => {
  if (!PaymentCollectionsDetails)
    return null
  let listData = []
  if (PaymentCollectionsDetails) {
    listData = PaymentCollectionsDetails.map(
      (item, index, array) => ({
        ...item,
        id: `${item.invoiceNo}-${item.receiptNo}`,
        countNumber: (index > 0 && array[index - 1].invoiceNo === item.invoiceNo) ? 0 : 1,
      }),
    )
  }

  const PaymentCollectionsColumns = [
    { name: 'invoiceNo', title: 'Invoice No.' },
    { name: 'totalAftGST', title: 'Total Amount' },
    { name: 'gstAmt', title: 'GST' },
    { name: 'patientName', title: 'Payer Name' },
    { name: 'receiptNo', title: 'Receipt No.' },
    { name: 'totalAmtPaid', title: 'payment' },
  ]

  const PaymentCollectionsColumnExtension = [
    { columnName: 'invoiceNo', width: 100 },
    { columnName: 'patientName', width: 180 },
    { columnName: 'totalAftGST', type: 'currency', currency: true },
    { columnName: 'gstAmt', type: 'currency', currency: true },
    { columnName: 'totalAmtPaid', type: 'currency', currency: true },
  ]
  const PaymentCollectionsRow = (p) => {
    const { row, children } = p
    if (row.countNumber === 1) {
      return <Table.Row {...p}>{children}</Table.Row>
    }
    const newchildren = [<Table.Cell colSpan='4'></Table.Cell>, children[4], children[5]]
    return <Table.Row {...p}>{newchildren}</Table.Row>
  }
  const FuncProps = {
    pager: false,
    summary: true,
    summaryConfig: {
      state: {
        totalItems: [
          { columnName: 'totalAftGST', type: 'totalAftGST' },
          { columnName: 'gstAmt', type: 'gstAmt' },
          { columnName: 'totalAmtPaid', type: 'totalAmtPaid' },
        ],
      },
      integrated: {
        calculator: (type, rows, getValue) => {
          if (type === 'totalAftGST') {
            return TotalDetails[0].grandTotalAftGST
          }
          if (type === 'gstAmt') {
            return TotalDetails[0].grandGSTAmt
          }
          if (type === 'totalAmtPaid') {
            return TotalDetails[0].grandTotalAmtPaid
          }
          return IntegratedSummary.defaultCalculator(type, rows, getValue)
        },
      },
      row: {
        messages: {
          totalAftGST: 'Total',
          gstAmt: 'Total',
          totalAmtPaid: 'Total',
        },
      },
    },
  }
  return (
    <ReportDataGrid
      height={500}
      data={listData}
      columns={PaymentCollectionsColumns}
      columnExtensions={PaymentCollectionsColumnExtension}
      FuncProps={FuncProps}
      TableProps={{ rowComponent: PaymentCollectionsRow }}
    />
  )
}

export default PaymentCollections
