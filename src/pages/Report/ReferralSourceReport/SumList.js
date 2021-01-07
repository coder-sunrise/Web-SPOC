import React, { PureComponent } from 'react'
import { ReportDataGrid } from '@/components/_medisys'
import { IntegratedSummary } from '@devexpress/dx-react-grid'

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
      { columnName: 'companyName', sortingEnabled: false },
      { columnName: 'referralPerson', sortingEnabled: false, width: 300 },
      { columnName: 'totalVisit', sortingEnabled: false, align: 'right', width: 300 },
      {
        columnName: 'totalInvoiceAmount',
        type: 'currency',
        currency: true,
        sortingEnabled: false,
        width: 200,
      },
    ]

    let FuncProps = {
      pager: false,
      summary: true,
      summaryConfig: {
        state: {
          totalItems: [
            { columnName: 'totalInvoiceAmount', type: 'invoiceAmountGrandTotal' },
            { columnName: 'totalVisit', type: 'visitGrandTotal' },
          ],
        },
        integrated: {
          calculator: (type, rows, getValue) => {
            if (type === 'visitGrandTotal') {
              return rows.length
            }
            if (type === 'invoiceAmountGrandTotal') {
              let amountSum = 0
              if (rows && rows.length > 0) {
                for (let p of rows) {
                  amountSum += p.totalInvoiceAmount
                }
              }
              return amountSum
            }
            return IntegratedSummary.defaultCalculator(type, rows, getValue)
          },
        },
        row: {
          messages: {
            visitGrandTotal: 'Grand Total',
            invoiceAmountGrandTotal: 'Grand Total',
          },
        },
      },
    }

    return (
      <ReportDataGrid
        style={{ marginTop: 6 }}
        noHeight
        data={sumData}
        columns={sumCols}
        columnExtensions={sumExtensions}
        flexible
        FuncProps={FuncProps}
      />
    )
  }
}
export default SumList
