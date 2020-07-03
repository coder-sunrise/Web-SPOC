import React, { PureComponent } from 'react'
import { withStyles } from '@material-ui/core'
import { Print, Delete } from '@material-ui/icons'
import CommonTableGrid from '@/components/CommonTableGrid'
import { Button, Tooltip, Popconfirm } from '@/components'
import { IntegratedSummary } from '@devexpress/dx-react-grid'

const DepositGrid = ({
  transactionList = [],
  handlePrint,
  handleDeleteRow,
}) => {
  const configs = {
    rows: transactionList,
    columns: [
      { name: 'transactionDate', title: 'Date' },
      { name: 'transactionTypeFK', title: 'Type' },
      { name: 'amount', title: 'Amount' },
      { name: 'transactionMode', title: 'Payment Mode' },
      { name: 'remarks', title: 'Remarks' },
      { name: 'action', title: 'Action' },
    ],
    columnExtensions: [
      { columnName: 'transactionDate', type: 'date' },
      {
        columnName: 'transactionTypeFK',
        type: 'codeSelect',
        code: 'LTDepositTransactionType',
      },
      { columnName: 'amount', type: 'currency' },
      {
        columnName: 'action',
        sortingEnabled: false,
        align: 'center',
        width: 100,
        render: (row) => {
          const { transactionTypeFK, amount = 0, refundableBalance } = row
          const isDeposit = transactionTypeFK === 1 //
          const isRefund = transactionTypeFK === 2
          const isEnableDelete = isDeposit && refundableBalance >= amount
          const isEnablePrint = isDeposit || isRefund
          return (
            <React.Fragment>
              {isEnablePrint && (
                <Tooltip title='Print Receipt' placement='bottom'>
                  <Button
                    size='sm'
                    onClick={() => {
                      handlePrint(row)
                    }}
                    justIcon
                    color='primary'
                    style={{ marginRight: 10, width: 25 }}
                  >
                    <Print />
                  </Button>
                </Tooltip>
              )}
              {isEnableDelete ? (
                <Tooltip title='Delete' placement='bottom'>
                  <Popconfirm
                    title='Are you sure you want to delete the selected item?'
                    onConfirm={() => {
                      handleDeleteRow(row)
                    }}
                  >
                    <Button
                      size='sm'
                      justIcon
                      color='danger'
                      style={{ marginRight: 0, width: 25 }}
                    >
                      <Delete />
                    </Button>
                  </Popconfirm>
                </Tooltip>
              ) : (
                <div
                  style={{
                    marginRight: 0,
                    width: 25,
                    display: 'inline-block',
                  }}
                />
              )}
            </React.Fragment>
          )
        },
      },
    ],
    FuncProps: {
      pager: false,
      sort: true,
      sortConfig: {
        defaultSorting: [
          { columnName: 'transactionDate', direction: 'desc' },
        ],
      },
    },
  }

  return <CommonTableGrid {...configs} />
}

export default DepositGrid
