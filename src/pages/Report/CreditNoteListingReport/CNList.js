import React, { PureComponent } from 'react'
import moment from 'moment'
import { IntegratedSummary } from '@devexpress/dx-react-grid'
import { ReportDataGrid } from '@/components/_medisys'
import { dateFormatLong } from '@/components'

class CNList extends PureComponent {
  render () {
    let listData = []
    const { reportDatas } = this.props
    if (!reportDatas) return null
    if (reportDatas.CreditNoteListingDetails) {
      listData = reportDatas.CreditNoteListingDetails.map((item, index) => ({
        ...item,
        id: `cnList-${index}-${item.creditNoteNo}`,
        date: moment(item.generatedDate).format(dateFormatLong),
      }))
    }

    let CreditNoteListingDetailsCols = [
      { name: 'creditNoteNo', title: 'Cn No.' },
      { name: 'account', title: 'Account' },
      { name: 'name', title: 'Name' },
      { name: 'remark', title: 'Remarks' },
      { name: 'doctorName', title: 'Doctor Name' },
      { name: 'invoiceNo', title: 'Invoice No.' },
      { name: 'invoiceDate', title: 'Invoice Date' },
      { name: 'total', title: 'Cn Amt.' },
    ]
    let CreditNoteListingDetailsExtensions = [
      { columnName: 'invoiceDate', type: 'date', sortingEnabled: false },
      {
        columnName: 'total',
        type: 'currency',
        currency: true,
        sortingEnabled: false,
      },
      {
        columnName: 'totalAftGST',
        type: 'currency',
        currency: true,
        sortingEnabled: false,
      },
      { columnName: 'creditNoteNo', sortingEnabled: false },
      { columnName: 'account', sortingEnabled: false },
      { columnName: 'name', sortingEnabled: false },
      { columnName: 'remark', sortingEnabled: false },
      { columnName: 'doctorName', sortingEnabled: false },
      { columnName: 'invoiceNo', sortingEnabled: false },
    ]
    if (reportDatas.ListingDetails[0].isDisplayGST) {
      CreditNoteListingDetailsCols.push({ name: 'gstAmt', title: 'GST' })
      CreditNoteListingDetailsExtensions.push({
        columnName: 'gstAmt',
        type: 'currency',
        currency: true,
        sortingEnabled: false,
      })
    }
    CreditNoteListingDetailsCols.push({ name: 'totalAftGST', title: 'Total' })

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
            if (type === 'grandTotal' || type === 'sum') {
              return rows.reduce((pre, cur) => {
                const v = getValue(cur)
                return pre + (v || 0)
              }, 0)
            }
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
      CNListCols = [
        { name: 'date', title: 'Date' },
        ...CreditNoteListingDetailsCols,
      ]
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
