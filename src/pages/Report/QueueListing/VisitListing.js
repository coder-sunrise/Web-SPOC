import React from 'react'
import {
  IntegratedSummary,
} from '@devexpress/dx-react-grid'
import moment from 'moment'
import {
  Table,
} from '@devexpress/dx-react-grid-material-ui'
import {
  dateFormatLong,
} from '@/components'
import { ReportDataGrid } from '@/components/_medisys'


const VisitListing = ({ reportDatas }) => {
  if (!reportDatas)
    return null
  let listData = []
  const { VisitListingDetails } = reportDatas
  if (VisitListingDetails) {
    listData = VisitListingDetails.map(
      (item, index) => ({
        ...item,
        id: `qListing-${index}-${item.visitReferenceNo}`,
        date: moment(item.visitDate).format(dateFormatLong),
      }),
    )
  }

  const VisitListingColumns = [
    { name: 'queueNo', title: 'Queue No.' },
    { name: 'patientName', title: 'Patient Name' },
    { name: 'doctorCode', title: 'Doctor' },
    { name: 'timeIn', title: 'Time In' },
    { name: 'timeOut', title: 'Time Out' },
    { name: 'invoiceNo', title: 'Invoice No' },
    { name: 'invoiceAmt', title: 'Invoice Amt.' },
    { name: 'gstAmt', title: 'GST' },
    { name: 'patientPaid', title: 'Patient Paid Amt.' },
    { name: 'paymentMode', title: 'Mode' },
    { name: 'patientOS', title: 'Patient O/S Amt.' },
    { name: 'coPayerPayable', title: 'Company Payable' },
    { name: 'coPayerName', title: 'Co-Payer' },
    { name: 'date', title: 'Visit Date' },
  ]

  const VisitListingColumnExtension = [
    { columnName: 'queueNo', width: 80 },
    { columnName: 'invoiceNo', width: 100 },
    { columnName: 'patientName', width: 180 },
    { columnName: 'invoiceAmt', type: 'currency', currency: true },
    { columnName: 'gstAmt', type: 'currency', currency: true },
    { columnName: 'patientPaid', type: 'currency', currency: true },
    { columnName: 'patientOS', type: 'currency', currency: true },
    { columnName: 'coPayerPayable', type: 'currency', currency: true },
    { columnName: 'coPayerPayable', wordWrapEnabled: true },
    { columnName: 'timeIn', width: 80, render: (row) => moment(row.timeIn).format('hh:mm A') },
    { columnName: 'timeOut', width: 80, render: (row) => moment(row.timeOut).format('hh:mm A') },
  ]

  const FuncProps = {
    pager: false,
    grouping: true,
    groupingConfig: {
      state: {
        grouping: [
          { columnName: 'date' },
        ],
      },
    },
    summary: true,
    summaryConfig: {
      state: {
        totalItems: [],
        groupItems: [
          { columnName: 'invoiceAmt', type: 'sumFirst' },
          { columnName: 'gstAmt', type: 'sumFirst' },
          { columnName: 'patientPaid', type: 'sum' },
          { columnName: 'patientOS', type: 'sumFirst' },
          { columnName: 'coPayerPayable', type: 'sumFirst' },
        ],
      },
      integrated: {
        calculator: (type, rows, getValue) => {
          if (type === 'sumFirst') {
            return rows.reduce((pre, cur) => {
              return pre + (cur.countNumber === 1 ? getValue(cur) : 0)
            }, 0)
          }
          return IntegratedSummary.defaultCalculator(type, rows, getValue)
        },
      },
      row: {
        messages: {
          sum: 'Total',
          sumFirst: 'Total',
        },
      },
    },
  }
  const visitListingRow = (p) => {
    const { row, children } = p
    if (row.countNumber === 1) {
      return <Table.Row {...p}>{children}</Table.Row>
    }
    const newchildren = [<Table.Cell colSpan="9"></Table.Cell>, children[9], children[10], <Table.Cell colSpan="3"></Table.Cell>]
    return <Table.Row {...p}>{newchildren}</Table.Row>

  }

  return (
    <ReportDataGrid
      height={500}
      data={listData}
      columns={VisitListingColumns}
      columnExtensions={VisitListingColumnExtension}
      FuncProps={FuncProps}
      TableProps={{ rowComponent: visitListingRow }}
    />
  )
}

export default VisitListing
