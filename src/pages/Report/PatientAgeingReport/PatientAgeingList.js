import React, { PureComponent } from 'react'
import { withStyles } from '@material-ui/core'
import { IntegratedSummary } from '@devexpress/dx-react-grid'
import { ReportDataGrid } from '@/components/_medisys'

const styles = (theme) => ({
  subRow: {
    '& > td:first-child': {
      paddingLeft: theme.spacing(1),
    },
  },
})

class PatientAgeingList extends PureComponent {
  render () {
    let listData = []
    const { reportDatas } = this.props
    if (!reportDatas) return null
    if (reportDatas && reportDatas.AgeingDetails) {
      listData = reportDatas.AgeingDetails.map((item, index) => ({
        ...item,
        id: `PatientAgeingList-${index}`,
        countNumber: 1,
        rowspan: 1,
      }))
    }

    const AgeingDetailsCols = [
      { name: 'patientReferenceNo', title: 'Patient Reference No.' },
      { name: 'patientAccountNo', title: 'Patient Account No.' },
      { name: 'patientName', title: 'Patient Name' },
      { name: 'currentOS', title: 'Current' },
      { name: 'preMonth1', title: '1 Mth' },
      { name: 'preMonth2', title: '2 Mth' },
      { name: 'preMore', title: '3 Mth Or More' },
      { name: 'total', title: 'Total' },
    ]

    const AgeingDetailsColsExtension = [
      { columnName: 'patientReferenceNo', width: 200, sortingEnabled: false },
      { columnName: 'patientAccountNo', width: 200, sortingEnabled: false },
      { columnName: 'patientName', sortingEnabled: false },
      { columnName: 'currentOS', type: 'currency', currency: true, sortingEnabled: false, width: 180 },
      { columnName: 'preMonth1', type: 'currency', currency: true, sortingEnabled: false, width: 180 },
      { columnName: 'preMonth2', type: 'currency', currency: true, sortingEnabled: false, width: 180 },
      { columnName: 'preMore', type: 'currency', currency: true, sortingEnabled: false, width: 180 },
      { columnName: 'total', type: 'currency', currency: true, sortingEnabled: false, width: 180 },
    ]

    const sumFirstCalculator = (type, rows, getValue) => {
      if (type === 'sumFirst') {
        return rows.reduce((pre, cur) => {
          return pre + (cur.countNumber === 1 ? getValue(cur) : 0)
        }, 0)
      }
      return IntegratedSummary.defaultCalculator(type, rows, getValue)
    }

    const FuncProps = {
      pager: false,
      summary: true,
      summaryConfig: {
        state: {
          totalItems: [
            { columnName: 'currentOS', type: 'sumFirst' },
            { columnName: 'preMonth1', type: 'sum' },
            { columnName: 'preMonth2', type: 'sum' },
            { columnName: 'preMore', type: 'sum' },
            { columnName: 'total', type: 'sum' },
          ],
        },
        integrated: { calculator: sumFirstCalculator },
        row: {
          messages: {
            sum: 'Total',
            sumFirst: 'Total',
          },
        },
      },
    }

    return (
      <ReportDataGrid
        data={listData}
        columns={AgeingDetailsCols}
        columnExtensions={AgeingDetailsColsExtension}
        FuncProps={FuncProps}
      />
    )
  }
}

export default withStyles (styles, { withTheme: true}) (PatientAgeingList)
