import React, { PureComponent } from 'react'
import { ReportDataGrid } from '@/components/_medisys'

class SumList extends PureComponent {
  render () {
    let sumData = []
    const { reportDatas } = this.props
    if (!reportDatas) return null
    if (reportDatas.ReferralSourceSummary) {
      sumData = reportDatas.ReferralSourceSummary.map((item, index) => ({
        ...item,
        id: `ReferralSourceSummary-${index}-${item.invoiceNo}`,
      }))
    }
    const sumCols = [
      { name: 'companyName', title: 'Referral Company' },
      { name: 'referralPerson', title: 'Referral Person' },
      { name: 'totalVisit', title: 'Total Visit' },
      { name: 'totalInvoiceAmount', title: 'Total Invoice Amount' },
    ]
    const sumExtensions = [
      { columnName: 'companyName', sortingEnabled: false},
      { columnName: 'referralPerson', sortingEnabled: false, width: 300 },
      { columnName: 'totalVisit', sortingEnabled: false, width: 300 },
      {
        columnName: 'totalInvoiceAmount',
        type: 'currency',
        currency: true,
        sortingEnabled: false,
        width: 200,
      },
    ]
    return (
      <ReportDataGrid
        style={{ marginTop: 6 }}
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
