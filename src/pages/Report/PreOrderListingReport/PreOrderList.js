import React, { PureComponent } from 'react'
import numeral from 'numeral'
import { IntegratedSummary } from '@devexpress/dx-react-grid'
import { Table } from '@devexpress/dx-react-grid-material-ui'
import { ReportDataGrid } from '@/components/_medisys'
import { filter } from 'lodash'
import moment from '@medisys/utils/node_modules/moment'
import { Tooltip } from '@/components'
import { showCurrency } from '@/utils/utils'

class PreOrderList extends PureComponent {
  render() {
    let preOrderListingDetailsData = []
    const { reportDatas } = this.props
    if (!reportDatas) return null
    if (reportDatas && reportDatas.PreOrderListingDetails) {
      preOrderListingDetailsData = reportDatas.PreOrderListingDetails.map(
        (item, index) => ({
          ...item,
          id: `Item-${index}-${item.id}`,
        }),
      )
    }

    const preOrderListingDetailsCols = [
      { name: 'patientName', title: 'Patient Name' },
      { name: 'referrenceNo', title: 'Ref. No.' },
      { name: 'accountNo', title: 'Acc No.' },
      { name: 'type', title: 'Type' },
      { name: 'itemName', title: 'Item Name' },
      { name: 'quantity', title: 'Order Qty.' },
      { name: 'orderBy', title: 'Order By' },
      { name: 'orderDate', title: 'Order Date' },
      { name: 'remarks', title: 'Remarks' },
      { name: 'apptDate', title: 'Appt. Date' },
      { name: 'amount', title: 'Total' },
      { name: 'paid', title: 'Paid' },
      { name: 'actualizedDate', title: 'Actualized Date' },
      { name: 'preOrderItemStatus', title: 'Status' },
    ]

    const preOrderListingDetailsColsExtension = [
      { columnName: 'patientName', sortingEnabled: false, width: 120 },
      { columnName: 'referrenceNo', sortingEnabled: false, width: 90 },
      { columnName: 'accountNo', sortingEnabled: false, width: 90 },
      { columnName: 'type', sortingEnabled: false, width: 100 },
      { columnName: 'itemName', sortingEnabled: false },
      {
        columnName: 'quantity',
        sortingEnabled: false,
        width: 120,
        align: 'right',
        render: row => {
          const displayQty = `${numeral(row.quantity).format(
            '0.0',
          )} ${row.uom || ''}`
          return (
            <Tooltip title={displayQty}>
              <span>{displayQty}</span>
            </Tooltip>
          )
        },
      },
      { columnName: 'orderBy', sortingEnabled: false, width: 120 },
      {
        columnName: 'orderDate',
        type: 'date',
        sortingEnabled: false,
        render: row => {
          return (
            <Tooltip
              title={
                row.orderDate
                  ? moment(row.orderDate).format('DD MMM YYYY HH:mm')
                  : '-'
              }
            >
              <span>
                {row.orderDate
                  ? moment(row.orderDate).format('DD MMM YYYY HH:mm')
                  : '-'}
              </span>
            </Tooltip>
          )
        },
        width: 140,
      },
      { columnName: 'remarks', sortingEnabled: false, width: 140 },
      {
        columnName: 'apptDate',
        type: 'date',
        sortingEnabled: false,
        render: row => {
          return (
            <Tooltip
              title={
                row.apptDate
                  ? moment(row.apptDate).format('DD MMM YYYY HH:mm')
                  : '-'
              }
            >
              <span>
                {row.apptDate
                  ? moment(row.apptDate).format('DD MMM YYYY HH:mm')
                  : '-'}
              </span>
            </Tooltip>
          )
        },
        width: 140,
      },
      {
        columnName: 'amount',
        sortingEnabled: false,
        width: 80,
        type: 'currency',
        currency: true,
        render: row => {
          return (
            <Tooltip
              title={row.paid === 'Yes' ? showCurrency(row.amount) : '-'}
            >
              <span>{row.paid === 'Yes' ? showCurrency(row.amount) : '-'}</span>
            </Tooltip>
          )
        },
      },
      { columnName: 'paid', sortingEnabled: false, width: 50 },
      {
        columnName: 'actualizedDate',
        type: 'date',
        sortingEnabled: false,
        width: 140,
        render: row => {
          return (
            <Tooltip
              title={
                row.actualizedDate
                  ? moment(row.actualizedDate).format('DD MMM YYYY HH:mm')
                  : '-'
              }
            >
              <span>
                {row.actualizedDate
                  ? moment(row.actualizedDate).format('DD MMM YYYY HH:mm')
                  : '-'}
              </span>
            </Tooltip>
          )
        },
      },
      { columnName: 'preOrderItemStatus', sortingEnabled: false, width: 100 },
    ]

    let FuncProps = {
      pager: false,
      summary: false,
    }
    return (
      <ReportDataGrid
        data={preOrderListingDetailsData}
        columns={preOrderListingDetailsCols}
        columnExtensions={preOrderListingDetailsColsExtension}
        FuncProps={FuncProps}
      />
    )
  }
}

export default PreOrderList
