import React, { PureComponent } from 'react'
import { ReportDataGrid } from '@/components/_medisys'

class Details extends PureComponent {
  render () {
    const { reportDatas } = this.props
    if (!reportDatas)
      return null
    
    let listData = []
    if (reportDatas && reportDatas.PackageExpiryDetails) {
      listData = reportDatas.PackageExpiryDetails.map(
        (item, index) => ({
          ...item,
          id: `PackageExpiryDetails-${index}`,
        }),
      )
    }

    const PackageExpiryDetailsCols = [
      { name: 'packageCode', title: 'Package' },
      // { name: 'invoiceNo', title: 'Invoice No.' },
      // { name: 'patientAccountNo', title: 'Patinet Acc. No.' },
      // { name: 'invoiceItemName', title: 'Invoice Item' },
      // { name: 'unitPrice', title: 'Unit Price' },
      // { name: 'qty', title: 'Qty.' },
      // { name: 'packageName', title: 'Package Name' },
      // { name: 'expiryDate', title: 'Exp. Date' },
      // { name: 'bfConsumeQuantity', title: 'Bring Forward Consumed Qty.' },
      // { name: 'bfRemainingQuantity', title: 'Bring Forward Balance Qty.' },
      // { name: 'bfRemainingAmount', title: 'Bring Forward Balance Amt.' },
      // { name: 'bfRevenueAmount', title: 'Bring Forward Revenue' },
      // { name: 'consumeQuantity', title: 'Consumed Qty.' },
      // { name: 'creditNoteQuantity', title: 'CN Qty.' },
      // { name: 'creditNoteAmount', title: 'CN Amount' },
      // { name: 'expiryQuantity', title: 'Exp Qty.' },
      // { name: 'revenueAmount', title: 'Revenue' },
      // { name: 'remainingQuantity', title: 'Balance Qty.' },
      // { name: 'remainingAmount', title: 'Balance Amt.' },
    ]

    const PackageExpiryDetailsExtensions = [
      { columnName: 'packageCode', sortingEnabled: false, wordWrapEnabled: true, width: 100 },
      // { columnName: 'invoiceNo', sortingEnabled: false, wordWrapEnabled: true, width: 90 },
      // { columnName: 'patientAccountNo', sortingEnabled: false, wordWrapEnabled: true, width: 100 },
      // { columnName: 'invoiceItemName', sortingEnabled: false, wordWrapEnabled: true, width: 200 },
      // { columnName: 'unitPrice', type: 'currency', currency: true, sortingEnabled: false, width: 100 },
      // { columnName: 'qty', type: 'number', sortingEnabled: false, width: 80 },
      // { columnName: 'packageName', sortingEnabled: false, wordWrapEnabled: true, width: 160 },
      // { columnName: 'expiryDate', type: 'date', sortingEnabled: false, width: 100 },
      // { columnName: 'bfConsumeQuantity', type: 'number', sortingEnabled: false, wordWrapEnabled: true, width: 120 },
      // { columnName: 'bfRemainingQuantity', type: 'number', sortingEnabled: false, wordWrapEnabled: true, width: 110 },
      // { columnName: 'bfRemainingAmount', type: 'currency', currency: true, sortingEnabled: false, wordWrapEnabled: true, width: 110 },
      // { columnName: 'bfRevenueAmount', type: 'currency', currency: true, sortingEnabled: false, wordWrapEnabled: true, width: 110 },
      // { columnName: 'consumeQuantity', type: 'number', sortingEnabled: false, wordWrapEnabled: true, width: 80 },
      // { columnName: 'creditNoteQuantity', type: 'number', sortingEnabled: false, width: 80 },
      // { columnName: 'creditNoteAmount', type: 'currency', currency: true, sortingEnabled: false, width: 110 },
      // { columnName: 'expiryQuantity', type: 'number', sortingEnabled: false, width: 80 },
      // { columnName: 'revenueAmount', type: 'currency', currency: true, sortingEnabled: false, width: 110 },
      // { columnName: 'remainingQuantity', type: 'number', sortingEnabled: false, wordWrapEnabled: true, width: 80 },
      // { columnName: 'remainingAmount', type: 'currency', currency: true, sortingEnabled: false, width: 110 },
    ]

    return (
      <ReportDataGrid
        forceRender
        data={listData}
        columns={PackageExpiryDetailsCols}
        columnExtensions={PackageExpiryDetailsExtensions}
      />
    )
  }
}
export default Details
