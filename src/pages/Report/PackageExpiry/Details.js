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
    if (reportDatas && reportDatas.PackageExpiryDetails) {
      listData = reportDatas.PackageExpiryDetails.map(
        (item, index) => ({
          ...item,
          id: `PackageExpiryDetails-${index}`,
        }),
      )
    }

    const patientGroupCellContent = ({ row }) => {  
      let label = ''
      if (!listData) return ''
      const data = listData.find(
        (item) => item.patientId === row.value,
      )
      if (data) {
        label = `${data.patientReferenceNo} - ${data.patientName} (${data.patientAccountNo}) tel: ${data.patientMobileNo}`
      }
      return (
        <span style={{ verticalAlign: 'middle', paddingRight: 8 }}>
          <strong>
            {label} 
          </strong>
        </span>
      )
    }

    const PackageExpiryDetailsCols = [
      { name: 'patientId', title: 'Patient Id' },
      { name: 'packageName', title: 'Package' },
      { name: 'packageItem', title: 'Item' },      
      { name: 'unitPrice', title: 'Unit Price' },
      { name: 'qty', title: 'Qty.' },
      { name: 'packageAmtBeforeAdj', title: 'Amount' },
      { name: 'adj', title: 'Adj.' },
      { name: 'packageAmtAfterAdj', title: 'Total' },
      { name: 'cnQty', title: 'CN Qty.' },
      { name: 'expiryDate', title: 'Expiry Date' },
      { name: 'consumeQty', title: 'Consumed Qty.' },
      { name: 'consumedAmount', title: 'Consumed Amount' },
      { name: 'expiredQty', title: 'Expired Qty.' },
      { name: 'expiredAmount', title: 'Expired Amount' },
      { name: 'balanceQty', title: 'Balance Qty.' },
      { name: 'balanceAmount', title: 'Balance Amount' },
    ]

    const PackageExpiryDetailsExtensions = [
      { columnName: 'packageName', sortingEnabled: false, wordWrapEnabled: true, width: 120 },
      { columnName: 'packageItem', sortingEnabled: false, wordWrapEnabled: true, width: 200 },
      { columnName: 'unitPrice', type: 'currency', currency: true, sortingEnabled: false, width: 100 },
      { columnName: 'qty', type: 'number', sortingEnabled: false, width: 70 },
      { columnName: 'packageAmtBeforeAdj', type: 'currency', currency: true, sortingEnabled: false, width: 140 },
      { columnName: 'adj', type: 'currency', currency: true, sortingEnabled: false, width: 140 },
      { columnName: 'packageAmtAfterAdj', type: 'currency', currency: true, sortingEnabled: false, width: 140 },
      { columnName: 'cnQty', type: 'number', sortingEnabled: false, width: 70 },
      { columnName: 'expiryDate', type: 'date', sortingEnabled: false, width: 100 },
      { columnName: 'consumeQty', type: 'number', sortingEnabled: false, wordWrapEnabled: true, width: 80 },
      { columnName: 'consumedAmount', type: 'currency', currency: true, sortingEnabled: false, width: 140 },
      { columnName: 'expiredQty', type: 'number', sortingEnabled: false, wordWrapEnabled: true, width: 70 },
      { columnName: 'expiredAmount', type: 'currency', currency: true, sortingEnabled: false, width: 140 },
      { columnName: 'balanceQty', type: 'number', sortingEnabled: false, wordWrapEnabled: true, width: 70 },
      { columnName: 'balanceAmount', type: 'currency', currency: true, sortingEnabled: false, width: 140 },
    ]

    const FuncProps = {
      pager: false,
      grouping: true,
      groupingConfig: {
        state: {
          grouping: [
            { columnName: 'patientId' },
          ],
        },
        row: {
          contentComponent: patientGroupCellContent,
        },
      },
      summary: true,
      summaryConfig: {
        state: {
          totalItems: [],
          groupItems: [
            { columnName: 'packageAmtBeforeAdj', type: 'sum' },
            { columnName: 'adj', type: 'sum' },
            { columnName: 'packageAmtAfterAdj', type: 'sum' },
            { columnName: 'consumedAmount', type: 'sum' },
            { columnName: 'expiredAmount', type: 'sum' },
            { columnName: 'balanceAmount', type: 'sum' },
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
        forceRender
        data={listData}
        columns={PackageExpiryDetailsCols}
        columnExtensions={PackageExpiryDetailsExtensions}
        FuncProps={FuncProps}
      />
    )
  }
}
export default Details
