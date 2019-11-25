import React, { PureComponent } from 'react'
import {
  IntegratedSummary,
} from '@devexpress/dx-react-grid'
import { ReportDataGrid } from '@/components/_medisys'
import { DateFormatter } from '@/components'

class DepositList extends PureComponent {
  render () {
    let listData = []
    const { reportDatas } = this.props
    if (!reportDatas)
      return null
    if (reportDatas && reportDatas.PatientDepositTransaction) {
      listData = reportDatas.PatientDepositTransaction.map(
        (item, index) => ({
          ...item,
          id: `depositlist-${index}-${item.patientName}`,
        }),
      )
    }

    const PatientDepositTransactionCols = [
      { name: 'transactionDate', title: 'Txn. Date' },
      { name: 'patientReferenceNo', title: 'Ref. No.' },
      { name: 'patientName', title: 'Name' },
      { name: 'txnCodeDetails', title: 'Txn. Code Details' },
      { name: 'txnAmount', title: 'Txn. Amount' },
      { name: 'paymentMode', title: 'Payment Mode' },
      { name: 'remarks', title: 'Remarks' },
      { name: 'depositBalance', title: 'Deposit Balance' },
    ]
    const PatientDepositTransactionExtensions = [
      {
        columnName: 'transactionDate',
        width: 180,
        render: (row) =>
          DateFormatter({
            value: row.transactionDate,
            full: true,
          }),
      },
      { columnName: 'depositBalance', type: 'currency', currency: true },
      { columnName: 'txnAmount', type: 'currency', currency: true },
    ]
    const FuncProps = {
      pager: false,
      summary: true,
      summaryConfig: {
        state: {
          totalItems: [
            { columnName: 'txnAmount', type: 'sum' },
          ],
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
      <ReportDataGrid
        data={listData}
        columns={PatientDepositTransactionCols}
        columnExtensions={PatientDepositTransactionExtensions}
        FuncProps={FuncProps}
      />
    )
  }
}
export default DepositList
