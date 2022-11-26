import React, { PureComponent } from 'react'
import { IntegratedSummary } from '@devexpress/dx-react-grid'
import { ReportDataGrid } from '@/components/_medisys'
import { dateFormatLongWithTimeNoSec12h } from '@/components'

class VoidCNList extends PureComponent {
  render() {
    let listData = []
    const { reportDatas } = this.props
    if (!reportDatas) return null
    if (reportDatas && reportDatas.VoidCreditNotePaymentDetails) {
      listData = reportDatas.VoidCreditNotePaymentDetails.map(
        (item, index) => ({
          ...item,
          id: `VoidCNList-${index}-${item.itemNo}`,
        }),
      )
    }

    let filterType = 'Credit Note'
    let generatedDateTitle = 'Cn Date'
    let itemNoTitle = 'Cn No.'
    if (
      reportDatas &&
      reportDatas.ListingDetails &&
      reportDatas.ListingDetails.length
    ) {
      filterType = reportDatas.ListingDetails[0].filterType
    }

    if (filterType === 'Payment') {
      generatedDateTitle = 'Payment Date'
      itemNoTitle = 'Payment No.'
    }

    const listCols = [
      { name: 'invoiceDate', title: 'Invoice Date' },
      { name: 'invoiceNo', title: 'Invoice No.' },
      {
        name: 'generatedDate',
        title: generatedDateTitle,
      },
      {
        name: 'itemNo',
        title: itemNoTitle,
      },
      { name: 'totalAmt', title: 'Amount' },
      { name: 'voidedBy', title: 'Voided By' },
      { name: 'voidedDate', title: 'Voided Date' },
      { name: 'reason', title: 'Reason' },
    ]
    const listColsExtension = [
      {
        columnName: 'invoiceDate',
        type: 'date',
        sortingEnabled: false,
        width: 120,
      },
      {
        columnName: 'generatedDate',
        type: 'date',
        sortingEnabled: false,
        width: 120,
      },
      {
        columnName: 'voidedDate',
        sortingEnabled: false,
        width: 200,
        // type: 'date',
        // format: dateFormatLongWithTimeNoSec12h,
        // showTime: true,
      },
      {
        columnName: 'totalAmt',
        type: 'currency',
        currency: true,
        sortingEnabled: false,
        width: 200,
      },
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
          totalItems: [{ columnName: 'totalAmt', type: 'sum' }],
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
        columns={listCols}
        columnExtensions={listColsExtension}
        FuncProps={FuncProps}
      />
    )
  }
}
export default VoidCNList
