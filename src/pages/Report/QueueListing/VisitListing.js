import React from 'react'
import { withStyles } from '@material-ui/core'
import {
  IntegratedSummary,
} from '@devexpress/dx-react-grid'
import {
  Table,
} from '@devexpress/dx-react-grid-material-ui'
import { ReportDataGrid } from '@/components/_medisys'

const styles = (theme) => ({
  subRow: {
    '& > td:first-child': {
      paddingLeft: theme.spacing(1),
    },
  },
})
const VisitListing = ({ reportDatas, classes }) => {
  if (!reportDatas)
    return null
  let listData = []
  const { VisitListingDetails } = reportDatas
  if (VisitListingDetails) {
    let count = 0
    for (let i = VisitListingDetails.length - 1; i >= 0; i--) {
      const item = VisitListingDetails[i]
      count += 1
      if (i === 0 || VisitListingDetails[i - 1].invoiceNo !== item.invoiceNo) {
        listData.splice(0, 0, {
          ...item,
          id: `qListing-${i}-${item.invoiceNo}`,
          countNumber: 1,
          rowspan: count,
        })
        count = 0
      } else {
        listData.splice(0, 0, {
          ...item,
          id: `qListing-${i}-${item.invoiceNo}`,
          countNumber: 0,
          rowspan: 0,
        })
      }
    }
  }

  const VisitListingColumns = [
    { name: 'queueNo', title: 'Queue No.' },
    { name: 'patientName', title: 'Patient Name' },
    { name: 'doctorName', title: 'Doctor' },
    { name: 'timeIn', title: 'Time In' },
    { name: 'timeOut', title: 'Time Out' },
    { name: 'invoiceNo', title: 'Invoice No' },
    { name: 'invoiceAmt', title: 'Invoice Amt.' },
    { name: 'gstAmt', title: 'GST' },
    { name: 'patientPaid', title: 'Patient Paid Amt.' },
    { name: 'paymentMode', title: 'Mode' },
    { name: 'patientOS', title: 'Patient O/S Amt.' },
    { name: 'coPayerPayable', title: 'Company Payable' },
    { name: 'coPayerName', title: 'Co-Payer' },
    { name: 'visitDate', title: 'Visit Date' },
  ]

  const VisitListingColumnExtension = [
    { columnName: 'queueNo', width: 80, sortingEnabled: false },
    { columnName: 'patientName', width: 180, sortingEnabled: false },
    { columnName: 'doctorName', width: 180, sortingEnabled: false },
    { columnName: 'timeIn', width: 80, sortingEnabled: false },
    { columnName: 'timeOut', width: 80, sortingEnabled: false },
    { columnName: 'invoiceNo', width: 100, sortingEnabled: false },
    { columnName: 'invoiceAmt', type: 'currency', currency: true, sortingEnabled: false },
    { columnName: 'gstAmt', type: 'currency', currency: true, sortingEnabled: false },
    { columnName: 'patientPaid', type: 'currency', currency: true, sortingEnabled: false },
    { columnName: 'paymentMode', width: 100, sortingEnabled: false },
    { columnName: 'patientOS', type: 'currency', currency: true, sortingEnabled: false },
    { columnName: 'coPayerPayable', type: 'currency', currency: true, sortingEnabled: false },
    { columnName: 'coPayerName', wordWrapEnabled: true, sortingEnabled: false },

  ]

  const FuncProps = {
    pager: false,
    grouping: true,
    groupingConfig: {
      state: {
        grouping: [
          { columnName: 'visitDate' },
        ],
      },
    },
    summary: true,
    summaryConfig: {
      state: {
        totalItems: [],
        groupItems: [
          { columnName: 'invoiceAmt', type: 'sumFirst' },
          { columnName: 'gstAmt', type: 'sumFirst' },
          { columnName: 'patientPaid', type: 'sum' },
          { columnName: 'patientOS', type: 'sumFirst' },
          { columnName: 'coPayerPayable', type: 'sumFirst' },
        ],
      },
      integrated: {
        calculator: (type, rows, getValue) => {
          if (type === 'sumFirst') {
            return rows.reduce((pre, cur) => {
              return pre + (cur.countNumber === 1 ? getValue(cur) : 0)
            }, 0)
          }
          return IntegratedSummary.defaultCalculator(type, rows, getValue)
        },
      },
      row: {
        messages: {
          sum: 'Total',
          sumFirst: 'Total',
        },
      },
    },
  }
  const visitListingRow = (p) => {
    const { row, children } = p
    if (row.countNumber === 1) {
      const newchildren = children.map((item, index) => (index < 9 || index > 10) ? {
        ...children[index],
        props: {
          ...children[index].props,
          rowSpan: row.rowspan,
        },
      } : item)
      return <Table.Row {...p}>{newchildren}</Table.Row>
    }
    return <Table.Row className={classes.subRow}>{[children[9], children[10]]} </Table.Row>
  }

  return (
    <ReportDataGrid
      data={listData}
      columns={VisitListingColumns}
      columnExtensions={VisitListingColumnExtension}
      FuncProps={FuncProps}
      TableProps={{ rowComponent: visitListingRow }}
    />
  )
}

export default withStyles(styles, { withTheme: true })(VisitListing)
