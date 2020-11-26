import React, { PureComponent } from 'react'
import {
  IntegratedSummary,
} from '@devexpress/dx-react-grid'

import { ReportDataGrid } from '@/components/_medisys'

class Details extends PureComponent {
  render () {
    const { reportDatas } = this.props
    if (!reportDatas)
      return null
    
    let listData = []
    if (reportDatas && reportDatas.RevenueDetails) {
      listData = reportDatas.RevenueDetails.map(
        (item, index) => ({
          ...item,
          id: `RevenueDetails-${index}`,
        }),
      )
    }

    const RevenueDetailsCols = [
      { name: 'invoiceDate', title: 'Date' },
      { name: 'invoiceNo', title: 'Invoice No.' },
      { name: 'patientAccountNo', title: 'Patinet Acc. No.' },
      { name: 'invoiceItemName', title: 'Invoice Item' },
      { name: 'unitPrice', title: 'Unit Price' },
      { name: 'qty', title: 'Qty.' },
      { name: 'packageName', title: 'Package Name' },
      { name: 'expiryDate', title: 'Exp. Date' },
      { name: 'bfConsumeQuantity', title: 'BF Consumed Qty.' },
      { name: 'bfRemainingQuantity', title: 'BF Balance Qty.' },
      { name: 'bfRemainingAmount', title: 'BF Balance Amt.' },
      { name: 'bfRevenueAmount', title: 'BF Revenue' },
      { name: 'consumeQuantity', title: 'Consumed Qty.' },
      { name: 'creditNoteQuantity', title: 'CN Qty.' },
      { name: 'creditNoteAmount', title: 'CN Amount' },
      { name: 'expiryQuantity', title: 'Exp Qty.' },
      { name: 'revenueAmount', title: 'Revenue' },
      { name: 'remainingQuantity', title: 'Balance Qty.' },
      { name: 'remainingAmount', title: 'Balance Amt.' },
    ]

    const RevenueDetailsExtensions = [
      { columnName: 'invoiceDate', type: 'date', sortingEnabled: false, width: 110 },
      { columnName: 'invoiceNo', sortingEnabled: false, wordWrapEnabled: true, width: 100 },
      { columnName: 'patientAccountNo', sortingEnabled: false, wordWrapEnabled: true, width: 130 },
      { columnName: 'invoiceItemName', sortingEnabled: false, wordWrapEnabled: true },
      { columnName: 'unitPrice', type: 'currency', currency: true, sortingEnabled: false, width: 100 },
      { columnName: 'qty', type: 'number', sortingEnabled: false, width: 80 },
      { columnName: 'packageName', sortingEnabled: false, wordWrapEnabled: true, width: 160 },
      { columnName: 'expiryDate', type: 'date', sortingEnabled: false, width: 100 },
      { columnName: 'bfConsumeQuantity', type: 'number', sortingEnabled: false, width: 140 },
      { columnName: 'bfRemainingQuantity', type: 'number', sortingEnabled: false, width: 120 },
      { columnName: 'bfRemainingAmount', type: 'currency', currency: true, sortingEnabled: false, width: 130 },
      { columnName: 'bfRevenueAmount', type: 'currency', currency: true, sortingEnabled: false, width: 120 },
      { columnName: 'consumeQuantity', type: 'number', sortingEnabled: false, width: 110 },
      { columnName: 'creditNoteQuantity', type: 'number', sortingEnabled: false, width: 80 },
      { columnName: 'creditNoteAmount', type: 'currency', currency: true, sortingEnabled: false, width: 120 },
      { columnName: 'expiryQuantity', type: 'number', sortingEnabled: false, width: 80 },
      { columnName: 'revenueAmount', type: 'currency', currency: true, sortingEnabled: false, width: 120 },
      { columnName: 'remainingQuantity', type: 'number', sortingEnabled: false, width: 100 },
      { columnName: 'remainingAmount', type: 'currency', currency: true, sortingEnabled: false, width: 120 },
    ]

    return (
      <ReportDataGrid
        forceRender
        data={listData}
        columns={RevenueDetailsCols}
        columnExtensions={RevenueDetailsExtensions}
      />
    )
  }
}
export default Details
