import React, { PureComponent } from 'react'
import { withStyles } from '@material-ui/core'
import { ReportDataGrid } from '@/components/_medisys'
import _ from 'lodash'

const styles = (theme) => ({
  subRow: {
    '& > td:first-child': {
      paddingLeft: theme.spacing(1),
    },
  },
})
class StatementInvoiceList extends PureComponent {
  render () {
    let listData = []
    const { reportDatas } = this.props
    if (!reportDatas) return null
    if (reportDatas && reportDatas.StatementInvoiceList) {
      for (let i = reportDatas.StatementInvoiceList.length - 1; i >= 0; i--) {
        const item = reportDatas.StatementInvoiceList[i]
        listData.splice(0, 0, {
          ...item,
          id: `StatementInvoiceList-${item.statementNo}-${item.invoiceNo}-${i}`,
          countNumber: 1,
          rowspan: 1,
          statementJoinCompany: `${item.companyName} (${item.statementNo})`,
        })
      }
    }

    let StatementInvoiceListCols = [
      { name: 'invoiceDate', title: 'Invoice Date' },
      { name: 'invoiceNo', title: 'Invoice No.' },
      { name: 'doctorName', title: 'Doctor Name' },
      { name: 'patientAccountNo', title: 'Acc. No.' },
      { name: 'patientName', title: 'Patient Name' },
      { name: 'invoiceAmt', title: 'Invoice Amt.' },
      { name: 'payableAmt', title: 'payable Amt.' },
      { name: 'outstanding', title: 'O/S Amt.' },
      { name: 'statementJoinCompany', title: 'Statement' },
    ]
    let StatementInvoiceListColsExtension = [
      {
        columnName: 'invoiceDate',
        type: 'date',
        width: 120,
        sortingEnabled: false,
      },
      { columnName: 'invoiceNo', sortingEnabled: false, width: 120 },
      { columnName: 'doctorName', sortingEnabled: false },
      { columnName: 'patientAccountNo', sortingEnabled: false, width: 150 },
      { columnName: 'patientName', sortingEnabled: false },
      {
        columnName: 'invoiceAmt',
        type: 'currency',
        currency: true,
        sortingEnabled: false,
        width: 120,
      },
      {
        columnName: 'payableAmt',
        type: 'currency',
        currency: true,
        sortingEnabled: false,
        width: 120,
      },
      {
        columnName: 'outstanding',
        type: 'currency',
        currency: true,
        sortingEnabled: false,
        width: 120,
      },
    ]

    let defaultExpandedGroups = _.uniqBy(listData, 'statementJoinCompany').map(
      (o) => o.statementJoinCompany,
    )

    let FuncProps = {
      pager: false,
      summary: false,
      grouping: true,
      groupingConfig: {
        state: {
          grouping: [
            { columnName: 'statementJoinCompany' },
          ],
          defaultExpandedGroups,
        },
      },
    }

    return (
      <ReportDataGrid
        data={listData}
        columns={StatementInvoiceListCols}
        columnExtensions={StatementInvoiceListColsExtension}
        FuncProps={FuncProps}
      />
    )
  }
}
export default withStyles(styles, { withTheme: true })(StatementInvoiceList)
