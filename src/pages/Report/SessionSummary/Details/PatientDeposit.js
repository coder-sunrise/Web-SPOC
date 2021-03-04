import React from 'react'
import { IntegratedSummary } from '@devexpress/dx-react-grid'
import { ReportDataGrid } from '@/components/_medisys'

const PatientDeposit = ({ DepositDatas }) => {
  let listData = []
  if (DepositDatas) {
    listData = DepositDatas.map((item, index) => ({
      ...item,
      id: `DepositDatas-${index}-${item.invoiceNo}`,
    }))
  }

  const PastPaymentCollectionTableColumn = [
    { name: 'patientName', title: 'Patient Name' },
    { name: 'patientReferenceNo', title: 'Ref No.' },
    { name: 'remarks', title: 'Remarks' },
    { name: 'paymentMode', title: 'Mode' },
    { name: 'amount', title: 'Amount' },
  ]

  const PastPaymentCollectionTableColumnExtension = [
    { columnName: 'patientName', sortingEnabled: false },
    { columnName: 'patientReferenceNo', sortingEnabled: false },
    { columnName: 'remarks', sortingEnabled: false },
    { columnName: 'paymentMode', sortingEnabled: false },
    {
      columnName: 'amount',
      type: 'currency',
      currency: true,
      sortingEnabled: false,
    },
  ]

  const FuncProps = {
    pager: false,
    summary: true,
    summaryConfig: {
      state: {
        totalItems: [
          { columnName: 'amount', type: 'sum' },
        ],
        groupItems: [
          { columnName: 'amount', type: 'sum' },
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
      columns={PastPaymentCollectionTableColumn}
      columnExtensions={PastPaymentCollectionTableColumnExtension}
      FuncProps={FuncProps}
    />
  )
}

export default PatientDeposit
