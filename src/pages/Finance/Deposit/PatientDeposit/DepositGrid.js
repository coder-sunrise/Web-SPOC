import React from 'react'
import _ from 'lodash'
import { Print, Delete } from '@material-ui/icons'
import CommonTableGrid from '@/components/CommonTableGrid'
import {
  Button,
  Tooltip,
  TextField,
  NumberInput,
  DatePicker,
  dateFormatLong,
} from '@/components'

const DepositGrid = ({
  transactionList = [],
  handlePrint,
  handleDeleteRow,
  hasActiveSession,
  isReadOnly,
  height,
}) => {
  const getDeleteStyle = (row) => {
    return {
      textDecorationLine:
        row.transactionTypeName !== 'Transfer' && row.isCancelled
          ? 'line-through'
          : '',
    }
  }
  const configs = {
    rows: _.orderBy(
      transactionList,
      [
        'transactionDate',
        'depositTransactionNo',
      ],
      [
        'desc',
        'desc',
      ],
    ).map((o) => {
      return { ...o, hasActiveSession }
    }),
    columns: [
      { name: 'transactionDate', title: 'Date' },
      { name: 'transactionTypeName', title: 'Type' },
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
              style={getDeleteStyle(row)}
            />
          )
        },
      },
      {
        columnName: 'transactionTypeName',
        width: 120,
        render: (row) => {
          return (
            <Tooltip title={row.transactionTypeName}>
              <span style={getDeleteStyle(row)}>{row.transactionTypeName}</span>
            </Tooltip>
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
              style={getDeleteStyle(row)}
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
              style={getDeleteStyle(row)}
            />
          )
        },
      },
      {
        columnName: 'remarks',
        render: (row) => {
          return (
            <Tooltip title={row.remarks}>
              <span style={getDeleteStyle(row)}>{row.remarks}</span>
            </Tooltip>
          )
        },
      },
      {
        columnName: 'cancelReason',
        render: (row) => {
          return (
            <Tooltip title={row.cancelReason}>
              <span style={getDeleteStyle(row)}>{row.cancelReason}</span>
            </Tooltip>
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
          const isDeposit = transactionTypeFK === 1
          const isRefund = transactionTypeFK === 2
          const isEnableDelete =
            isDeposit && refundableBalance >= amount && !isReadOnly
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
                      disabled={!row.hasActiveSession}
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

  return (
    <CommonTableGrid
      {...configs}
      TableProps={{
        height,
      }}
    />
  )
}

export default DepositGrid
