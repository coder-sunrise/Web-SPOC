import React, { PureComponent } from 'react'
import { IntegratedSummary } from '@devexpress/dx-react-grid'
// common components
import { Table } from '@devexpress/dx-react-grid-material-ui'
import { ReportDataGrid } from '@/components/_medisys'

class ReferralSourceList extends PureComponent {
  render () {
    let listData = []
    const { reportDatas } = this.props
    if (!reportDatas) return null
    if (reportDatas && reportDatas.ReferralSourceListSummary) {
      listData = reportDatas.ReferralSourceListSummary.map((item, index) => ({
        ...item,
        id: `ReferralSourceListSummary-${index}-${item.patientReferenceNo}`,
      }))
    }
    const ReferralSourceListingColumns = [
      { name: 'referralPerson', title: 'Referral Person' },
      { name: 'visitDate', title: 'Visit Date' },
      { name: 'referrenceNo', title: 'Patient ID' },
      { name: 'patientName', title: 'Doctor' },
      { name: 'doctor', title: 'Next Appt.' },
      { name: 'nextAppt', title: 'Invoice No.' },
      { name: 'invoiceNo', title: 'Invoice Amount' },
      { name: 'invoiceAmount', title: 'Remarks' },
    ]

    const ReferralSourceListingColumnsExtensions = [
      { columnName: 'referralPerson', sortingEnabled: false },
      { columnName: 'visitDate', type: 'date', sortingEnabled: false },
      { columnName: 'referrenceNo', sortingEnabled: false, width: 180 },
      { columnName: 'patientName', sortingEnabled: false },
      { columnName: 'doctor', sortingEnabled: false },
      { columnName: 'nextAppt', type: 'date', sortingEnabled: false },
      { columnName: 'invoiceNo', sortingEnabled: false },
      { columnName: 'invoiceAmount', sortingEnabled: false },
    ]
    const SummaryRow = (p) => {
      const { children } = p
      let countCol = children.find((c) => {
        return (
          c.props.tableColumn.column &&
          c.props.tableColumn.column.name === 'referralPerson'
        )
      })
      if (countCol) {
        const newChildren = [
          {
            ...countCol,
            props: {
              ...countCol.props,
              colSpan: 3,
            },
            key: 1111,
          },
        ]
        return <Table.Row {...p}>{newChildren}</Table.Row>
      }
      return <Table.Row {...p}>{children}</Table.Row>
    }

    let FuncProps = {
      pager: false,
      summary: true,
      summaryConfig: {
        state: {
          totalItems: [
            { columnName: 'referralPerson', type: 'patientCount' },
          ],
        },
        integrated: {
          calculator: (type, rows, getValue) => {
            let patientIds = []
            if (type === 'patientCount') {
              if (rows && rows.length > 0) {
                for (let p of rows) {
                  if (!patientIds.includes(p.patientProfileID)) {
                    patientIds.push(p.patientProfileID)
                  }
                }
              }
              return patientIds.length
            }
            return IntegratedSummary.defaultCalculator(type, rows, getValue)
          },
        },
        row: {
          totalRowComponent: SummaryRow,
          messages: {
            patientCount: 'Total Number of ReferralSource',
          },
        },
      },
    }

    if (
      reportDatas.ReferralSourceListDetails &&
      reportDatas.ReferralSourceListDetails.length > 0 &&
      reportDatas.ReferralSourceListDetails[0].isGroupByDoctor
    ) {
      FuncProps = {
        ...FuncProps,
        summary: true,
        summaryConfig: {
          state: {
            totalItems: [
              { columnName: 'referralPerson', type: 'patientCount' },
            ],
            groupItems: [
              { columnName: 'referralPerson', type: 'groupCount' },
            ],
          },
          integrated: {
            calculator: (type, rows, getValue) => {
              let patientIds = []
              if (type === 'patientCount' || type === 'groupCount') {
                if (rows && rows.length > 0) {
                  for (let p of rows) {
                    if (!patientIds.includes(p.patientProfileID)) {
                      patientIds.push(p.patientProfileID)
                    }
                  }
                }
                return patientIds.length
              }
              return IntegratedSummary.defaultCalculator(type, rows, getValue)
            },
          },
          row: {
            totalRowComponent: SummaryRow,
            groupRowComponent: SummaryRow,
            messages: {
              groupCount: 'Total Number of ReferralSource',
              patientCount: 'Grand Total Number of ReferralSource',
            },
          },
        },
        grouping: true,
        groupingConfig: {
          state: {
            grouping: [
              { columnName: 'doctorName' },
            ],
          },
        },
      }
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
