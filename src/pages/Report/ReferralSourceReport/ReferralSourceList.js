import React, { PureComponent } from 'react'
import { IntegratedSummary } from '@devexpress/dx-react-grid'
// common components
import moment from 'moment'
import { ReportDataGrid } from '@/components/_medisys'

class ReferralSourceList extends PureComponent {
  render () {
    let listData = []
    const { reportDatas } = this.props
    if (!reportDatas) return null
    if (reportDatas && reportDatas.ReferralSourceList) {
      listData = reportDatas.ReferralSourceList.map((item, index) => ({
        ...item,
        visitDate: moment(item.visitDate).format('DD MMM YYYY'),
        id: `ReferralSourceList-${index}-${item.patientReferenceNo}`,
      }))
    }
    const ReferralSourceListingColumns = [
      { name: 'companyName', title: 'Referral Source' },
      { name: 'referralPerson', title: 'Referral Person' },
      { name: 'visitDate', title: 'Visit Date' },
      { name: 'patientReferenceNo', title: 'Patient ID' },
      { name: 'patientName', title: 'Patient' },
      { name: 'doctorName', title: 'Optometrist' },
      { name: 'nextApptDate', title: 'Next Appt.' },
      { name: 'invoiceNo', title: 'Invoice No.' },
      { name: 'invoiceAmount', title: 'Invoice Amount' },
      { name: 'remarks', title: 'Remarks' },
    ]

    const ReferralSourceListingColumnsExtensions = [
      { columnName: 'companyName', sortingEnabled: false, align: 'right' },
      { columnName: 'referralPerson', sortingEnabled: false },
      { columnName: 'visitDate', width: 140, sortingEnabled: false },
      { columnName: 'patientReferenceNo', sortingEnabled: false, width: 140 },
      { columnName: 'patientName', sortingEnabled: false },
      { columnName: 'doctor', sortingEnabled: false },
      { columnName: 'nextApptDate', width: 180, sortingEnabled: false },
      { columnName: 'remarks', sortingEnabled: false },
      { columnName: 'invoiceNo', width: 110, sortingEnabled: false },
      {
        columnName: 'invoiceAmount',
        type: 'currency',
        width: 180,
        sortingEnabled: false,
      },
    ]

    let FuncProps = {
      pager: false,
      summary: true,
      summaryConfig: {
        state: {
          groupItems: [
            { columnName: 'invoiceAmount', type: 'invoiceAmountSum' },
            { columnName: 'visitDate', type: 'visitCount' },
          ],
          totalItems: [
            { columnName: 'invoiceAmount', type: 'groupCount' },
            { columnName: 'visitDate', type: 'visitGrandTotal' },
          ],
        },
        integrated: {
          calculator: (type, rows, getValue) => {
            if (type === 'visitCount') {
              return rows.length
            }
            if (type === 'invoiceAmountSum' || type === 'groupCount') {
              let amountSum = 0
              if (rows && rows.length > 0) {
                for (let p of rows) {
                  amountSum += p.invoiceAmount
                }
              }
              return amountSum
            }
            if (type === 'visitGrandTotal') {
              return rows.length
            }
            return IntegratedSummary.defaultCalculator(type, rows, getValue)
          },
        },
        row: {
          messages: {
            visitCount: 'Total Visit',
            groupCount: 'Grand Total',
            visitGrandTotal: 'Grand Total',
            invoiceAmountSum: 'Total',
          },
        },
      },
      grouping: true,
      groupingConfig: {
        state: {
          grouping: [ { columnName: 'companyName' } ],
        },
        row: {
          contentComponent: (group) => {
            const { row } = group
            if (
              row.compoundKey !== 'Patient As Referral' &&
              row.key !== 'Patient As Referral' &&
              row.value !== 'Patient As Referral'
            ) {
              return <span>Referral Source: {row.value}</span>
            }
            return <span>Patient As Referral</span>
          },
        },
      },
    }

    return (
      <ReportDataGrid
        data={listData}
        columns={ReferralSourceListingColumns}
        columnExtensions={ReferralSourceListingColumnsExtensions}
        FuncProps={FuncProps}
      />
    )
  }
}
export default ReferralSourceList
