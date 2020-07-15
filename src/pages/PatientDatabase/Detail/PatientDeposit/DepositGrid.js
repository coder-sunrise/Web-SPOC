import React, { PureComponent } from 'react'
import { withStyles } from '@material-ui/core'
import { Print, Delete } from '@material-ui/icons'
import CommonTableGrid from '@/components/CommonTableGrid'
import {
  Button,
  Tooltip,
  Popconfirm,
  TextField,
  CodeSelect,
  NumberInput,
  DatePicker,
  dateFormatLong,
} from '@/components'
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
      { name: 'cancelReason', title: 'Cancel Reason' },
      { name: 'action', title: 'Action' },
    ],
    columnExtensions: [
      {
        columnName: 'transactionDate',
        type: 'date',
        width: 120,
        render: (row) => {
          return (
            <DatePicker
              text
              format={dateFormatLong}
              value={row.transactionDate}
              style={
                row.isCancelled ? { textDecorationLine: 'line-through' } : {}
              }
            />
          )
        },
      },
      {
        columnName: 'transactionTypeFK',
        type: 'codeSelect',
        code: 'LTDepositTransactionType',
        width: 120,
        render: (row) => {
          return (
            <CodeSelect
              text
              code='LTDepositTransactionType'
              value={row.transactionTypeFK}
              style={
                row.isCancelled ? { textDecorationLine: 'line-through' } : {}
              }
            />
          )
        },
      },
      {
        columnName: 'amount',
        type: 'currency',
        width: 120,
        render: (row) => {
          return (
            <NumberInput
              currency
              text
              value={row.amount}
              style={
                row.isCancelled ? { textDecorationLine: 'line-through' } : {}
              }
            />
          )
        },
      },
      {
        columnName: 'transactionMode',
        width: 120,
        render: (row) => {
          return (
            <TextField
              text
              value={row.transactionMode}
              style={
                row.isCancelled ? { textDecorationLine: 'line-through' } : {}
              }
            />
          )
        },
      },
      {
        columnName: 'remarks',
        render: (row) => {
          return (
            <TextField
              text
              value={row.remarks}
              style={
                row.isCancelled ? { textDecorationLine: 'line-through' } : {}
              }
            />
          )
        },
      },
      {
        columnName: 'cancelReason',
        render: (row) => {
          return (
            <TextField
              text
              value={row.cancelReason}
              style={
                row.isCancelled ? { textDecorationLine: 'line-through' } : {}
              }
            />
          )
        },
      },
      {
        columnName: 'action',
        sortingEnabled: false,
        align: 'center',
        width: 100,
        render: (row) => {
          const {
            transactionTypeFK,
            amount = 0,
            refundableBalance,
            isCancelled,
          } = row
          const isDeposit = transactionTypeFK === 1 //
          const isRefund = transactionTypeFK === 2
          const isEnableDelete = isDeposit && refundableBalance >= amount
          const isEnablePrint = isDeposit || isRefund
          return (
            !isCancelled && (
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
                    <Button
                      size='sm'
                      justIcon
                      color='danger'
                      style={{ marginRight: 0, width: 25 }}
                      onClick={() => {
                        handleDeleteRow(row)
                      }}
                    >
                      <Delete />
                    </Button>
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
