import React, { PureComponent } from 'react'
import {
  IntegratedSummary,
} from '@devexpress/dx-react-grid'
import { ReportDataGrid } from '@/components/_medisys'

class SalesList extends PureComponent {
  render () {
    let listData = []
    const { reportDatas } = this.props
    if (!reportDatas)
      return null
    if (reportDatas && reportDatas.SalesListingByPerformerDetails) {
      listData = reportDatas.SalesListingByPerformerDetails.map(
        (item, index) => ({
          ...item,
          id: `SalesList-${index}-${item.invoiceno}`,
        }),
      )
    }

    const SalesDetailsCols = [
      { name: 'date', title: 'Date' },
      { name: 'invoiceNo', title: 'Invoice No.' },
      { name: 'patientReferenceNo', title: 'Ref. No.' },
      { name: 'patientAccountNo', title: 'Acc. No.' },
      { name: 'patientName', title: 'Patient Name' },
      { name: 'itemType', title: 'Category' },
      { name: 'invoiceItemName', title: 'Invoice Item' },
      { name: 'amount', title: 'Amount' },
      { name: 'adjAmt', title: 'Adj.' },
      { name: 'total', title: 'Total' },
      { name: 'earnedRevenue', title: 'Earned Revenue' },
      { name: 'performedBy', title: 'Performed By' },
    ]
    const SalesDetailsExtensions = [
      { columnName: 'date', type: 'date', sortingEnabled: false, width: 110 },
      { columnName: 'invoiceNo', sortingEnabled: false, width: 100, wordWrapEnabled: true },
      { columnName: 'patientReferenceNo', sortingEnabled: false, width: 100, wordWrapEnabled: true },
      { columnName: 'patientAccountNo', sortingEnabled: false, width: 100, wordWrapEnabled: true },
      { columnName: 'patientName', sortingEnabled: false, width: 160, wordWrapEnabled: true },
      { columnName: 'itemType', sortingEnabled: false, wordWrapEnabled: true, width: 110 },
      { columnName: 'invoiceItemName', sortingEnabled: false, wordWrapEnabled: true },
      { columnName: 'amount', type: 'currency', currency: true, sortingEnabled: false, width: 140, wordWrapEnabled: true },
      { columnName: 'adjAmt', type: 'currency', currency: true, sortingEnabled: false, width: 120, wordWrapEnabled: true },
      { columnName: 'total', type: 'currency', currency: true, sortingEnabled: false, width: 140, wordWrapEnabled: true },
      { columnName: 'earnedRevenue', type: 'currency', currency: true, sortingEnabled: false, width: 140, wordWrapEnabled: true },
      { columnName: 'performedBy', sortingEnabled: false, width: 110, wordWrapEnabled: true },
    ]

    let FuncProps = {
      pager: false,
      summary: true,
      summaryConfig: {
        state: {
          totalItems: [
            { columnName: 'amount', type: 'sum' },
            { columnName: 'adjAmt', type: 'sum' },
            { columnName: 'total', type: 'sum' },
            { columnName: 'earnedRevenue', type: 'sum' },
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
    
    return (
      <ReportDataGrid
        data={listData}
        columns={SalesDetailsCols}
        columnExtensions={SalesDetailsExtensions}
        FuncProps={FuncProps}
      />
    )
  }
}
export default SalesList
