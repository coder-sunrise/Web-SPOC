import React, { PureComponent } from 'react'
import {
  IntegratedSummary,
} from '@devexpress/dx-react-grid'
import { ReportDataGrid } from '@/components/_medisys'

class ChasList extends PureComponent {
  render () {
    let listData = []
    const { reportDatas } = this.props
    if (!reportDatas)
      return null
    if (reportDatas && reportDatas.CHASClaimsDetails) {
      listData = reportDatas.CHASClaimsDetails.map(
        (item, index) => ({
          ...item,
          id: `ChasList-${index}-${item.invoiceno}`,
        }),
      )
    }

    const SalesDetailsCols = [
      { name: 'visitDate', title: 'Visit Date' },
      { name: 'patientAccountNo', title: 'Patinet ID' },
      { name: 'patientName', title: 'Patient Name' },
      { name: 'doctorName', title: 'Doctor Name' },
      { name: 'schemeName', title: 'Scheme Name' },
      { name: 'invoiceNo', title: 'Invoice No' },
      { name: 'invoiceAmt', title: 'Invoice Amt.' },
      { name: 'claimAmt', title: 'Claim Amt.' },
      { name: 'claimStatus', title: 'Claim Status' },
      { name: 'remarks', title: 'Remarks' },
    ]
    const SalesDetailsExtensions = [
      { columnName: 'visitDate', type: 'date', sortingEnabled: false, width: 120 },
      { columnName: 'patientAccountNo', sortingEnabled: false, width: 120 },
      { columnName: 'patientName', sortingEnabled: false, wordWrapEnabled: true },
      { columnName: 'doctorName', sortingEnabled: false, wordWrapEnabled: true },
      { columnName: 'schemeName', sortingEnabled: false, wordWrapEnabled: true },
      { columnName: 'invoiceNo', sortingEnabled: false, width: 100 },
      { columnName: 'invoiceAmt', type: 'currency', currency: true, sortingEnabled: false, width: 140 },
      { columnName: 'claimAmt', type: 'currency', currency: true, sortingEnabled: false, width: 180, wordWrapEnabled: true },
      { columnName: 'claimStatus', sortingEnabled: false, wordWrapEnabled: true, width: 120 },
      { columnName: 'remarks', sortingEnabled: false, wordWrapEnabled: true },
    ]

    let FuncProps = {
      pager: false,
      summary: true,
      summaryConfig: {
        state: {
          totalItems: [
            { columnName: 'invoiceAmt', type: 'sum' },
            { columnName: 'claimAmt', type: 'sum' },
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
    let ChasListCols = SalesDetailsCols
    let ChasListColsExtension = SalesDetailsExtensions
    if (reportDatas.ListingDetails[0].groupByDoctor) {
      FuncProps = {
        ...FuncProps,
        summaryConfig: {
          state: {
            totalItems: [],
            groupItems: [
              { columnName: 'invoiceAmt', type: 'sum' },
              { columnName: 'claimAmt', type: 'sum' },
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
              { columnName: 'schemeName' },
            ],
          },
        },
      }
    }
    return (
      <ReportDataGrid
        data={listData}
        columns={ChasListCols}
        columnExtensions={ChasListColsExtension}
        FuncProps={FuncProps}
      />
    )
  }
}
export default ChasList
