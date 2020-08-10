import React, { PureComponent } from 'react'
import { ReportDataGrid } from '@/components/_medisys'

class SumList extends PureComponent {
  render () {
    let sumData = []
    const { reportDatas } = this.props
    if (!reportDatas) return null
    if (reportDatas.SubSumPayment) {
      sumData = reportDatas.SubSumPayment.map((item, index) => ({
        ...item,
        id: `SubSumPayment-${index}-${item.invoiceNo}`,
      }))
    }
    const sumExtensions = [
      {
        columnName: 'sumAmount',
        type: 'currency',
        currency: true,
        sortingEnabled: false,
        width: 200,
      },
      { columnName: 'paymentMode', sortingEnabled: false, width: 300 },
    ]
    const sumCols = [
      { name: 'paymentMode', title: 'Payment Mode' },
      { name: 'sumAmount', title: 'Amount' },
    ]
    return (
      <ReportDataGrid
        style={{ width: 500, marginTop: 6 }}
        noHeight
        data={sumData}
        columns={sumCols}
        columnExtensions={sumExtensions}
        flexible
      />
    )
  }
}
export default SumList
