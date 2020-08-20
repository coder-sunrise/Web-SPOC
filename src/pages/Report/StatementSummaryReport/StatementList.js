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
class StatementList extends PureComponent {
  render () {
    let listData = []
    const { reportDatas } = this.props
    if (!reportDatas)
      return null
    if (reportDatas && reportDatas.StatementSummaryDetails) {
      for (let i = reportDatas.StatementSummaryDetails.length - 1; i >= 0; i--) {
        const item = reportDatas.StatementSummaryDetails[i]
        listData.splice(0, 0, {
          ...item, 
          id: `StatementList-${item.invoiceno}-${i}`,
          countNumber: 1,
          rowspan: 1, 
        })
      }
    }

    let StatementListCols = [
      { name: 'invoiceDate', title: 'Date' },
      { name: 'invoiceNo', title: 'Invoice No.' },
      { name: 'refNo', title: 'Ref. No.' },
      { name: 'companyName', title: 'Company Name' },
      { name: 'invoiceAmt', title: 'Invoice Amt.' },
      { name: 'adjustments', title: 'Adjustments' },
      { name: 'osAmt', title: 'O/S Amt.' },
    ]
    let StatementListColsExtension = [
      { columnName: 'invoiceDate', type: 'date', width: 150, sortingEnabled: false },
      { columnName: 'invoiceNo', sortingEnabled: false },
      { columnName: 'refNo', sortingEnabled: false },
      { columnName: 'companyName', width: 300, sortingEnabled: false },
      { columnName: 'invoiceAmt', type: 'currency', currency: true, sortingEnabled: false },
      { columnName: 'adjustments', type: 'currency', currency: true, sortingEnabled: false },
      { columnName: 'osAmt', type: 'currency', currency: true, sortingEnabled: false },
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
            { columnName: 'invoiceAmt', type: 'sumFirst' },
            { columnName: 'adjustments', type: 'sum' },
            { columnName: 'osAmt', type: 'sum' },
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

    if (reportDatas.ListingDetails[0].groupByCompany) {
      StatementListCols.splice(2,1)
      StatementListColsExtension.splice(2,1)
      FuncProps = {
        ...FuncProps,
        summaryConfig: {
          state: {
            totalItems: [],
            groupItems: [
              { columnName: 'invoiceAmt', type: 'sumFirst' },
              { columnName: 'adjustments', type: 'sum' },
              { columnName: 'osAmt', type: 'sum' },
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
              { columnName: 'companyName' },
            ],
          },
        },
      }
    }
    const listingRow = (p) => {
      const { children } = p
      return <Table.Row {...p}>{children}</Table.Row>
    }


    return (
      <ReportDataGrid
        data={listData}
        columns={StatementListCols}
        columnExtensions={StatementListColsExtension}
        FuncProps={FuncProps}
        TableProps={{ rowComponent: listingRow }}
      />
    )
  }
}
export default withStyles(styles, { withTheme: true })(StatementList)
