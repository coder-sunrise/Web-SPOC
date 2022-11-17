import React, { PureComponent } from 'react'
import { IntegratedSummary } from '@devexpress/dx-react-grid'
import { withStyles } from '@material-ui/core/styles'

import { ReportDataGrid } from '@/components/_medisys'

const styles = () => ({
  paymentModeHeader: {
    whiteSpace: 'pre-line',
    wordBreak: 'break-word',
  },
})
class PaymentCollectionSummaryDetails extends PureComponent {
  render() {
    const { reportDatas, classes } = this.props
    if (!reportDatas) return null
    let PaymentCollectionSummaryDetailsCols = [
      { name: 'paymentDate', title: 'Date' },
    ]
    let PaymentCollectionSummaryDetailsExtensions = [
      { columnName: 'paymentDate', type: 'date', sortingEnabled: false },
    ]
    let grouping = []
    const {
      PaymentCollectionInfo: [sumDetail = {}],
    } = reportDatas
    const { groupByDoctor, groupByCompany } = sumDetail

    if (groupByDoctor) {
      PaymentCollectionSummaryDetailsCols = [
        { name: 'doctorName', title: 'Optometrist Name' },
        ...PaymentCollectionSummaryDetailsCols,
      ]

      PaymentCollectionSummaryDetailsExtensions = [
        { columnName: 'doctorName', sortingEnabled: false },
        ...PaymentCollectionSummaryDetailsExtensions,
      ]

      grouping = [{ columnName: 'doctorName' }, ...grouping]
    }

    if (groupByCompany) {
      PaymentCollectionSummaryDetailsCols = [
        { name: 'payerName', title: 'Co-Payer Name' },
        ...PaymentCollectionSummaryDetailsCols,
      ]

      PaymentCollectionSummaryDetailsExtensions = [
        { columnName: 'payerName', sortingEnabled: false },
        ...PaymentCollectionSummaryDetailsExtensions,
      ]

      grouping = [{ columnName: 'payerName' }, ...grouping]
    }

    let listData = []
    let colInfo = []
    let groupItems = []
    let categories = {}
    if (reportDatas.PaymentCollectionSummaryDetails) {
      for (let cur of reportDatas.PaymentCollectionSummaryDetails) {
        if (categories[cur.paymentMode] === undefined) {
          categories[cur.paymentMode] = 0
          PaymentCollectionSummaryDetailsExtensions.push({
            columnName: cur.paymentMode,
            type: 'currency',
            currency: true,
            sortingEnabled: false,
          })
          groupItems.push({ columnName: cur.paymentMode, type: 'sum' })
          colInfo.push({
            name: cur.paymentMode,
            title: (
              <div className={classes.paymentModeHeader}>{cur.paymentMode}</div>
            ),
            sortOrder: cur.sortOrder,
          })
        }
        if (cur.paymentDate) {
          const curId = `PaymentCollectionSummaryDetails-${cur.payerName ||
            ''}-${cur.doctorName || ''}-${cur.paymentDate}`
          let record = listData.find(value => value.id === curId)
          if (record) {
            record[cur.paymentMode] =
              record[cur.paymentMode] === undefined
                ? cur.amount
                : record[cur.paymentMode] + cur.amount
          } else {
            record = {
              id: curId,
              payerName: cur.payerName,
              doctorName: cur.doctorName,
              paymentDate: cur.paymentDate,
            }

            record[cur.paymentMode] = cur.amount
            listData.push(record)
          }
        }
      }
      colInfo.sort((a, b) => {
        if (a.sortOrder < b.sortOrder) return -1
        return 1
      })
    }
    PaymentCollectionSummaryDetailsCols = [
      ...PaymentCollectionSummaryDetailsCols,
      ...colInfo,
    ]

    listData = listData.map(value => ({ ...categories, ...value }))

    const FuncProps = {
      pager: false,
      grouping: true,
      groupingConfig: {
        state: {
          grouping: [...grouping],
        },
      },
      summary: true,
      summaryConfig: {
        state: {
          totalItems: [],
          groupItems,
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
      <div>
        <ReportDataGrid
          data={listData}
          columns={PaymentCollectionSummaryDetailsCols}
          columnExtensions={PaymentCollectionSummaryDetailsExtensions}
          FuncProps={FuncProps}
        />
      </div>
    )
  }
}
export default withStyles(styles, { withTheme: true })(
  PaymentCollectionSummaryDetails,
)
