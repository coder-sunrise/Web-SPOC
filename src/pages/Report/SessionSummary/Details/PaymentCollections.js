import React from 'react'
import { withStyles } from '@material-ui/core'

import { IntegratedSummary } from '@devexpress/dx-react-grid'
import { Table } from '@devexpress/dx-react-grid-material-ui'
import { ReportDataGrid } from '@/components/_medisys'

const styles = (theme) => ({
  subRow: {
    '& > td:first-child': {
      paddingLeft: theme.spacing(1),
    },
  },
})

const PaymentCollections = ({
  PaymentCollectionsDetails,
  TotalDetails,
  classes,
}) => {
  if (!PaymentCollectionsDetails) return null
  let listData = []
  if (PaymentCollectionsDetails) {
    let paymentCount = 0
    for (let i = PaymentCollectionsDetails.length - 1; i >= 0; i--) {
      const item = PaymentCollectionsDetails[i]
      paymentCount += 1
      if (
        i === 0 ||
        PaymentCollectionsDetails[i - 1].invoiceNo !== item.invoiceNo
      ) {
        listData.splice(0, 0, {
          ...item,
          id: `${item.invoiceNo}-${item.receiptNo}`,
          countNumber: 1,
          rowspan: paymentCount,
        })
        paymentCount = 0
      } else {
        listData.splice(0, 0, {
          ...item,
          id: `${item.invoiceNo}-${item.receiptNo}`,
          countNumber: 0,
          rowspan: 0,
        })
      }
    }
  }

  const PaymentCollectionsColumns = [
    { name: 'invoiceNo', title: 'Invoice No.' },
    { name: 'totalAftAdj', title: 'Total Amount' },
    { name: 'gstAmt', title: 'GST' },
    { name: 'payerName', title: 'Payer Name' },
    { name: 'receiptNo', title: 'Receipt No.' },
    { name: 'totalAmtPaid', title: 'payment' },
  ]

  const PaymentCollectionsColumnExtension = [
    { columnName: 'invoiceNo', width: 100 },
    { columnName: 'payerName', width: 180 },
    { columnName: 'totalAftAdj', type: 'currency', currency: true },
    { columnName: 'gstAmt', type: 'currency', currency: true },
    { columnName: 'totalAmtPaid', type: 'currency', currency: true },
  ]
  const PaymentCollectionsRow = (p) => {
    const { row, children } = p
    if (row.countNumber === 1) {
      const newchildren = children.map(
        (item, index) =>
          index < 4
            ? {
                ...item,
                props: {
                  ...item.props,
                  rowSpan: row.rowspan,
                },
              }
            : item,
      )
      return <Table.Row {...p}>{newchildren}</Table.Row>
    }
    // const newchildren = [
    //   {
    //     ...children[4],
    //     props: {
    //       ...children[4].props,
    //       style: { paddingLeft: 8 },
    //     },
    //   },
    //   children[5],
    // ]
    // return <Table.Row {...p}>{newchildren}</Table.Row>
    return <Table.Row className={classes.subRow} {...p} />
  }
  const FuncProps = {
    pager: false,
    summary: true,
    summaryConfig: {
      state: {
        totalItems: [
          { columnName: 'totalAftAdj', type: 'totalAftAdj' },
          { columnName: 'gstAmt', type: 'gstAmt' },
          { columnName: 'totalAmtPaid', type: 'totalAmtPaid' },
        ],
      },
      integrated: {
        calculator: (type, rows, getValue) => {
          if (type === 'totalAftAdj') {
            return TotalDetails[0].grandTotalAftAdj
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
          totalAftAdj: 'Total',
          gstAmt: 'Total',
          totalAmtPaid: 'Total',
        },
      },
    },
  }
  return (
    <ReportDataGrid
      data={listData}
      columns={PaymentCollectionsColumns}
      columnExtensions={PaymentCollectionsColumnExtension}
      FuncProps={FuncProps}
      TableProps={{ rowComponent: PaymentCollectionsRow }}
    />
  )
}

export default withStyles(styles, { withTheme: true })(PaymentCollections)
