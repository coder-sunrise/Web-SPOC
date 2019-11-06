import React, { PureComponent } from 'react'
import {
  IntegratedSummary,
} from '@devexpress/dx-react-grid'
import { ReportDataGrid } from '@/components/_medisys'

class OutstandingList extends PureComponent {
  render () {
    let listData = []
    const { reportDatas } = this.props
    if (!reportDatas)
      return null
    if (reportDatas && reportDatas.OutstandingPaymentDetails) {
      listData = reportDatas.OutstandingPaymentDetails.map(
        (item, index) => ({
          ...item,
          id: `OutstandingList-${index}-${item.invoiceno}`,
        }),
      )
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
      { columnName: 'date', type: 'date' },
      { columnName: 'invoiceamt', type: 'currency', currency: true },
      { columnName: 'payableamt', type: 'currency', currency: true },
      { columnName: 'osamt', type: 'currency', currency: true },
    ]

    let FuncProps = {
      pager: false,
      summary: true,
      summaryConfig: {
        state: {
          totalItems: [
            { columnName: 'invoiceamt', type: 'sum' },
            { columnName: 'payableamt', type: 'sum' },
            { columnName: 'osamt', type: 'sum' },
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
    let OutstandingListCols = OutstandingPaymentDetailsCols
    let OutstandingListColsExtension = OutstandingPaymentDetailsExtensions
    if (reportDatas.ListingDetails[0].groupByDoctor) {
      FuncProps = {
        ...FuncProps,
        summaryConfig: {
          state: {
            totalItems: [],
            groupItems: [
              { columnName: 'invoiceamt', type: 'sum' },
              { columnName: 'payableamt', type: 'sum' },
              { columnName: 'osamt', type: 'sum' },
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
    return (
      <ReportDataGrid
        height={500}
        data={listData}
        columns={OutstandingListCols}
        columnExtensions={OutstandingListColsExtension}
        FuncProps={FuncProps}
      />
    )
  }
}
export default OutstandingList
