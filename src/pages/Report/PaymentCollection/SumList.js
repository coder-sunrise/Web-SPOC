import React, { PureComponent } from 'react'
import { ReportDataGrid } from '@/components/_medisys'

class SumList extends PureComponent {
  render () {
    let sumData = []
    const { reportDatas } = this.props
    if (!reportDatas)
      return null
    if (reportDatas.SubSumPayment) {
      sumData = reportDatas.SubSumPayment.map(
        (item, index) => ({
          ...item,
          id: `SubSumPayment-${index}-${item.invoiceNo}`,
        }),
      )
    }
    const sumExtensions = [
      { columnName: 'sumAmount', type: 'currency', currency: true },
    ]
    const sumCols = [
      { name: 'paymentMode', title: 'Payment Mode' },
      { name: 'sumAmount', title: 'Amount' },
    ]
    return (
      <ReportDataGrid
        data={sumData}
        columns={sumCols}
        columnExtensions={sumExtensions}
      />
    )
  }
}
export default SumList
