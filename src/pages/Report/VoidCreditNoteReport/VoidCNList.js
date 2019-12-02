import React, { PureComponent } from 'react'
import {
  IntegratedSummary,
} from '@devexpress/dx-react-grid'
import { ReportDataGrid } from '@/components/_medisys'
import {
  DateFormatter,
  dateFormatLongWithTimeNoSec12h,
} from '@/components'

class VoidCNList extends PureComponent {
  render () {
    let listData = []
    const { reportDatas } = this.props
    if (!reportDatas)
      return null
    if (reportDatas && reportDatas.VoidCreditNotePaymentDetails) {
      listData = reportDatas.VoidCreditNotePaymentDetails.map(
        (item, index) => ({
          ...item,
          id: `VoidCNList-${index}-${item.itemNo}`,
        }),
      )
    }

    const listCols = [
      { name: 'invoiceDate', title: 'Invoice Date' },
      { name: 'invoiceNo', title: 'Invoice No.' },
      { name: 'generatedDate', title: 'CN Date' },
      { name: 'itemNo', title: 'CN No.' },
      { name: 'totalAmt', title: 'Amount' },
      { name: 'voidedBy', title: 'Voided By' },
      { name: 'voidedDate', title: 'Voided Date' },
      { name: 'reason', title: 'Reason' },
    ]
    const listColsExtension = [
      { columnName: 'invoiceDate', type: 'date', sortingEnabled: false, width: 120 },
      { columnName: 'generatedDate', type: 'date', sortingEnabled: false, width: 120 },
      {
        columnName: 'voidedDate',
        sortingEnabled: false,
        width: 200,
        type: 'date',
        render: (row) =>
          DateFormatter({
            value: row.voidedDate,
            full: true,
            format: dateFormatLongWithTimeNoSec12h,
          }),
      },
      { columnName: 'totalAmt', type: 'currency', currency: true, sortingEnabled: false, width: 200 },
      { columnName: 'invoiceNo', sortingEnabled: false, width: 120 },
      { columnName: 'itemNo', sortingEnabled: false, width: 120 },
      { columnName: 'voidedBy', sortingEnabled: false },
      { columnName: 'reason', sortingEnabled: false },
    ]

    let FuncProps = {
      pager: false,
      summary: true,
      summaryConfig: {
        state: {
          totalItems: [
            { columnName: 'totalAmt', type: 'sum' },
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

    if (reportDatas.ListingDetails[0].filtertype === 'Payment') {
      listCols[2].title = 'Payment Date'
      listCols[3].title = 'Payment No.'
    }
    return (
      <ReportDataGrid
        data={listData}
        columns={listCols}
        columnExtensions={listColsExtension}
        FuncProps={FuncProps}
      />
    )
  }
}
export default VoidCNList
