import React, { PureComponent } from 'react'
import moment from 'moment'
import {
  IntegratedSummary,
} from '@devexpress/dx-react-grid'
import { ReportDataGrid } from '@/components/_medisys'
import {
  dateFormatLong,
} from '@/components'

class CNList extends PureComponent {
  render () {
    let listData = []
    const { reportDatas } = this.props
    if (!reportDatas)
      return null
    if (reportDatas && reportDatas.CreditNoteListingDetails) {
      listData = reportDatas.CreditNoteListingDetails.map(
        (item, index) => ({
          ...item,
          id: `cnList-${index}-${item.creditNoteNo}`,
          date: moment(item.generatedDate).format(dateFormatLong),
        }),
      )
    }

    const CreditNoteListingDetailsCols = [
      { name: 'creditNoteNo', title: 'CR No.' },
      { name: 'account', title: 'Account' },
      { name: 'name', title: 'Name' },
      { name: 'remark', title: 'Remarks' },
      { name: 'doctorName', title: 'Doctor Name' },
      { name: 'invoiceNo', title: 'Invoice No.' },
      { name: 'invoiceDate', title: 'Invoice Date' },
      { name: 'total', title: 'CN Amt.' },
      { name: 'gstAmt', title: 'GST' },
      { name: 'totalAftGST', title: 'Total' },
    ]
    const CreditNoteListingDetailsExtensions = [
      { columnName: 'invoiceDate', type: 'date' },
      { columnName: 'total', type: 'currency', currency: true },
      { columnName: 'gstAmt', type: 'currency', currency: true },
      { columnName: 'totalAftGST', type: 'currency', currency: true },
    ]

    let FuncProps = {
      pager: false,
      summary: true,
      summaryConfig: {
        state: {
          totalItems: [
            { columnName: 'total', type: 'grandTotal' },
            { columnName: 'gstAmt', type: 'grandTotal' },
            { columnName: 'totalAftGST', type: 'grandTotal' },
          ],
          groupItems: [
            { columnName: 'total', type: 'sum' },
            { columnName: 'gstAmt', type: 'sum' },
            { columnName: 'totalAftGST', type: 'sum' },
          ],
        },
        integrated: {
          calculator: (type, rows, getValue) => {
            if (type === 'grandTotal')
              return IntegratedSummary.defaultCalculator('sum', rows, getValue)
            return IntegratedSummary.defaultCalculator(type, rows, getValue)
          },
        },
        row: {
          messages: {
            sum: 'Total',
            grandTotal: 'Grand Total',
          },
        },
      },
    }
    let CNListCols = CreditNoteListingDetailsCols
    let CNListColsExtension = CreditNoteListingDetailsExtensions
    if (reportDatas.ListingDetails[0].isGroupByDoctor) {
      FuncProps = {
        ...FuncProps,
        grouping: true,
        groupingConfig: {
          state: {
            grouping: [
              { columnName: 'doctorName' },
            ],
          },
        },
      }
    } else {
      CNListCols = [{ name: 'date', title: 'Date' }, ...CreditNoteListingDetailsCols]
      FuncProps = {
        ...FuncProps,
        grouping: true,
        groupingConfig: {
          state: {
            grouping: [
              { columnName: 'date' },
            ],
          },
        },
      }
    }
    return (
      <ReportDataGrid
        data={listData}
        columns={CNListCols}
        columnExtensions={CNListColsExtension}
        FuncProps={FuncProps}
      />
    )
  }
}
export default CNList
