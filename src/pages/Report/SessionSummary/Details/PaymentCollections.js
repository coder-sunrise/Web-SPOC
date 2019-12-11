import React from 'react'
import { withStyles } from '@material-ui/core'

import { IntegratedSummary } from '@devexpress/dx-react-grid'
import { Table } from '@devexpress/dx-react-grid-material-ui'
import { bool } from 'prop-types'
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
    let payerCount = 0
    for (let i = PaymentCollectionsDetails.length - 1; i >= 0; i--) {
      let item = PaymentCollectionsDetails[i]
      item.id = `${item.invoiceNo}-${item.receiptNo}`
      paymentCount += 1
      payerCount += 1
      if (i === 0) {
        item.countNumber = 1
        item.rowspan = paymentCount
        item.payerCountNumber = 1
        item.payerRowspan = payerCount
      } else if (PaymentCollectionsDetails[i - 1].invoiceNo === item.invoiceNo) {
        item.countNumber = 0
        item.rowspan = 0
        if (PaymentCollectionsDetails[i - 1].payerName !== item.payerName) {
          item.payerCountNumber = 1
          item.payerRowspan = payerCount
          payerCount = 0
        } else {
          item.payerCountNumber = 0
          item.payerRowspan = 0
        }
      } else {
        item.countNumber = 1
        item.rowspan = paymentCount
        item.payerCountNumber = 1
        item.payerRowspan = payerCount
        payerCount = 0
        paymentCount = 0
      }
      listData.splice(0, 0, item)
    }
  }

  let PaymentCollectionsColumns = [
    { name: 'invoiceNo', title: 'Invoice No.' },
    { name: 'totalAftAdj', title: 'Total Amount' },
    { name: 'gstAmt', title: 'Gst' },
    { name: 'payerName', title: 'Payer Name' },
    { name: 'receiptNo', title: 'Receipt No.' },
    { name: 'totalAmtPaid', title: 'Payment' },
  ]

  let PaymentCollectionsColumnExtension = [
    { columnName: 'invoiceNo', width: 100, sortingEnabled: false },
    { columnName: 'totalAftAdj', type: 'currency', currency: true, sortingEnabled: false, width: 180 },
    { columnName: 'gstAmt', type: 'currency', currency: true, sortingEnabled: false, width: 180 },
    { columnName: 'payerName', sortingEnabled: false, wordWrapEnabled: true },
    { columnName: 'totalAmtPaid', type: 'currency', currency: true, sortingEnabled: false, width: 180 },
    { columnName: 'receiptNo', sortingEnabled: false, width: 100 },
  ]
  let totalItems = [
    { columnName: 'totalAftAdj', type: 'totalAftAdj' },
    { columnName: 'gstAmt', type: 'gstAmt' },
    { columnName: 'totalAmtPaid', type: 'totalAmtPaid' },
  ]
  if (!TotalDetails[0].isDisplayGST) {
    PaymentCollectionsColumns.splice(2, 1)
    PaymentCollectionsColumnExtension.splice(2, 1)
    totalItems.splice(1, 1)
  }
  const PaymentCollectionsRow = (p) => {
    const { row, children } = p
    let newchildren = []
    if (row.countNumber === 1) {
      newchildren.push(children.filter((value, index) => index < 3).map(
        (item) => ({
          ...item,
          props: {
            ...item.props,
            rowSpan: row.rowspan,
          },
        })
      ))
    }
    if (row.payerCountNumber === 1) {
      newchildren.push(children.filter((value, index) => index === 3).map(
        (item) => ({
          ...item,
          props: {
            ...item.props,
            rowSpan: row.payerRowspan,
          },
        })
      ))
    }
    newchildren.push([children[4], children[5]])
    if (row.countNumber === 1) {
      return <Table.Row {...p}>{newchildren}</Table.Row>
    }
    return <Table.Row {...p} className={classes.subRow}>{newchildren}</Table.Row>
  }
  const FuncProps = {
    pager: false,
    summary: true,
    summaryConfig: {
      state: {
        totalItems,
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
