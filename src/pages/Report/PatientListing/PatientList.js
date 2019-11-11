import React, { PureComponent } from 'react'
// common components
import { Accordion, CardContainer, GridContainer, GridItem, DateFormatter } from '@/components'
import { ReportDataGrid } from '@/components/_medisys'
import {
  Table,
} from '@devexpress/dx-react-grid-material-ui'

class PatientList extends PureComponent {
  render() {
    let listData = []
    const { reportDatas } = this.props
    if (!reportDatas)
      return null
    if (reportDatas && reportDatas.PatientListSummary) {
      listData = reportDatas.PatientListSummary.map(
        (item, index) => ({
          ...item,
          id: `PatientListSummary-${index}-${item.patientReferenceNo}`,
        }),
      )
    }
    const PatientListingColumns = [
      { name: 'patientReferenceNo', title: 'Reference No.' },
      { name: 'patientAccountNo', title: 'Acc. No.' },
      { name: 'patientName', title: 'Patient Name' },
      { name: 'doctorName', title: 'Last Visit Doctor' },
      { name: 'lastVisitDate', title: 'Last Visit Date' },
      { name: 'vC_Gender', title: 'Gender' },
      { name: 'vC_AgeInYear', title: 'Age' },
      { name: 'vC_Nationality', title: 'Nationality' },
      { name: 'vC_MobileNo', title: 'Mobile No.' },
      { name: 'vC_EmailAddress', title: 'Email Address' },
      { name: 'startDateTime', title: 'Next Appt.' },
    ]

    const PatientListingColumnsExtensions = [
      { columnName: 'lastVisitDate', type: 'date' },
      {
        columnName: 'startDateTime',
        width: 180,
        render: (row) =>
          DateFormatter({
            value: row.startDateTime,
            full: true,
          }),
      },
    ]
    const SummaryRow = (p) => {
      const { children } = p
      let countCol = children.find((c) => {
        return c.props.tableColumn.column.name === 'patientReferenceNo';
      })
      console.log({ countCol })
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
            { columnName: 'patientReferenceNo', type: 'patientCount' },
          ],
        },
        integrated: {
          calculator: (type, rows, getValue) => {
            console.log({ type, rows, getValue })
            let patientIds = []
            if (type === 'patientCount') {
              if (rows && rows.length > 0) {
                for (let p of rows) {
                  if (!patientIds.includes(p.patientProfileID)) {
                    patientIds.push(p.patientProfileID)
                  }
                }
              }
              return patientIds.length;
            }
            return IntegratedSummary.defaultCalculator(type, rows, getValue)
          },
        },
        row: {
          totalRowComponent: SummaryRow,
          messages: {
            patientCount: 'Total Number of Patient',
          },
        },
      },
    }
    console.log({ reportDatas })
    if (reportDatas.PatientListDetails && reportDatas.PatientListDetails.length > 0 && reportDatas.PatientListDetails[0].isGroupByDoctor) {
      FuncProps = {
        ...FuncProps,
        summary: true,
        summaryConfig: {
          state: {
            totalItems: [
              { columnName: 'patientReferenceNo', type: 'patientCount' },
            ],
            groupItems: [
              { columnName: 'patientReferenceNo', type: 'groupCount' },
            ],
          },
          integrated: {
            calculator: (type, rows, getValue) => {
              console.log({ type, rows, getValue })
              let patientIds = []
              if (type === 'patientCount' || type === 'groupCount') {
                if (rows && rows.length > 0) {
                  for (let p of rows) {
                    if (!patientIds.includes(p.patientProfileID)) {
                      patientIds.push(p.patientProfileID)
                    }
                  }
                }
                return patientIds.length;
              }
              return IntegratedSummary.defaultCalculator(type, rows, getValue)
            },
          },
          row: {
            totalRowComponent: SummaryRow,
            groupRowComponent: SummaryRow,
            messages: {
              groupCount: 'Total Number of Patient',
              patientCount: 'Grand Total Number of Patient',
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
        height={500}
        data={listData}
        columns={PatientListingColumns}
        columnExtensions={PatientListingColumnsExtensions}
        FuncProps={FuncProps}
      />
    )
  }
}
export default PatientList
