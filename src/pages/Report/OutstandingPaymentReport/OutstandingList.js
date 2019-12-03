import React, { PureComponent } from 'react'
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
class OutstandingList extends PureComponent {
  render () {
    let listData = []
    const { reportDatas, classes } = this.props
    if (!reportDatas)
      return null
    if (reportDatas.OutstandingPaymentDetails) {
      let count = 0
      for (let i = reportDatas.OutstandingPaymentDetails.length - 1; i >= 0; i--) {
        const item = reportDatas.OutstandingPaymentDetails[i]
        count += 1
        if (i === 0 || reportDatas.OutstandingPaymentDetails[i - 1].invoiceno !== item.invoiceno) {
          listData.splice(0, 0, {
            ...item,
            id: `OutstandingList-${item.invoiceno}-${i}`,
            countNumber: 1,
            rowspan: count,
          })
          count = 0
        } else {
          listData.splice(0, 0, {
            ...item,
            id: `OutstandingList-${item.invoiceno}-${i}`,
            countNumber: 0,
            rowspan: 0,
          })
        }
      }
    }
    const OutstandingPaymentDetailsCols = [
      { name: 'date', title: 'Date' },
      { name: 'invoiceno', title: 'Invoice No.' },
      { name: 'doctor', title: 'Doctor Name' },
      { name: 'patientAccountNo', title: 'Acc. No.' },
      { name: 'patientname', title: 'Patient Name' },
      { name: 'invoiceamt', title: 'Invoice Amt.' },
      { name: 'account', title: 'Ref. No.' },
      { name: 'payername', title: 'Payer Name' },
      { name: 'payableamt', title: 'Payable Amt.' },
      { name: 'osamt', title: 'O/S Amt.' },
    ]
    const OutstandingPaymentDetailsExtensions = [
      { columnName: 'date', type: 'date', sortingEnabled: false },
      { columnName: 'invoiceamt', type: 'currency', currency: true, sortingEnabled: false },
      { columnName: 'payableamt', type: 'currency', currency: true, sortingEnabled: false },
      { columnName: 'osamt', type: 'currency', currency: true, sortingEnabled: false },
      { columnName: 'invoiceno', sortingEnabled: false },
      { columnName: 'doctor', sortingEnabled: false },
      { columnName: 'patientAccountNo', sortingEnabled: false },
      { columnName: 'patientname', sortingEnabled: false },
      { columnName: 'account', sortingEnabled: false },
      { columnName: 'payername', sortingEnabled: false },
    ]
    const sumFirstCalculator = (type, rows, getValue) => {
      if (type === 'sumFirst') {
        return rows.reduce((pre, cur) => {
          return pre + (cur.countNumber === 1 ? getValue(cur) : 0)
        }, 0)
      }
      return IntegratedSummary.defaultCalculator(type, rows, getValue)
    }

    let FuncProps = {
      pager: false,
      summary: true,
      summaryConfig: {
        state: {
          totalItems: [
            { columnName: 'invoiceamt', type: 'sumFirst' },
            { columnName: 'payableamt', type: 'sum' },
            { columnName: 'osamt', type: 'sum' },
          ],
        },
        integrated: { calculator: sumFirstCalculator },
        row: {
          messages: {
            sum: 'Total',
            sumFirst: 'Total',
          },
        },
      },
    }
    let OutstandingListCols = OutstandingPaymentDetailsCols
    let OutstandingListColsExtension = OutstandingPaymentDetailsExtensions
    if (reportDatas.ListingDetails[0].groupByDoctor) {
      FuncProps = {
        ...FuncProps,
        summaryConfig: {
          state: {
            totalItems: [],
            groupItems: [
              { columnName: 'invoiceamt', type: 'sumFirst' },
              { columnName: 'payableamt', type: 'sum' },
              { columnName: 'osamt', type: 'sum' },
            ],
          },
          integrated: { calculator: sumFirstCalculator },
          row: {
            messages: {
              sum: 'Total',
              sumFirst: 'Total',
            },
          },
        },
        grouping: true,
        groupingConfig: {
          state: {
            grouping: [
              { columnName: 'doctor' },
            ],
          },
        },
      }
    }
    const listingRow = (p) => {
      const { row, children } = p
      if (row.countNumber === 1) {
        const newchildren = children.map((item, index) => (index < 6) ? {
          ...children[index],
          props: {
            ...children[index].props,
            rowSpan: row.rowspan,
          },
        } : item)
        return <Table.Row {...p}>{newchildren}</Table.Row>
      }
      return <Table.Row className={classes.subRow}>{[children[6], children[7], children[8], children[9]]} </Table.Row>
    }

    return (
      <ReportDataGrid
        data={listData}
        columns={OutstandingListCols}
        columnExtensions={OutstandingListColsExtension}
        FuncProps={FuncProps}
        TableProps={{ rowComponent: listingRow }}
      />
    )
  }
}
export default withStyles(styles, { withTheme: true })(OutstandingList)
