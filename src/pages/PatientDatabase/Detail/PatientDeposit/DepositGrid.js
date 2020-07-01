import React, { PureComponent } from 'react'
import { withStyles } from '@material-ui/core'
import { Print, Delete } from '@material-ui/icons'
import CommonTableGrid from '@/components/CommonTableGrid'
import { Button, Tooltip, Popconfirm } from '@/components'
import { Table } from '@devexpress/dx-react-grid-material-ui'

const DepositGrid = ({ transactionList = [], handlePrint }) => {
  const configs = {
    rows: transactionList,
    columns: [
      { name: 'transactionDate', title: 'Date' },
      { name: 'transactionTypeFK', title: 'Type' },
      { name: 'amount', title: 'Amount' },
      { name: 'transactionModeFK', title: 'Payment Mode' },
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
        columnName: 'transactionModeFK',
        type: 'codeSelect',
        code: 'CTPaymentMode',
      },
      {
        columnName: 'action',
        sortingEnabled: false,
        align: 'center',
        width: 100,
        render: (row) => {
          return (
            <React.Fragment>
              <Tooltip title='Print Receipt' placement='bottom'>
                <Button
                  size='sm'
                  onClick={() => {
                    handlePrint(row)
                  }}
                  justIcon
                  color='primary'
                  style={{ marginRight: 10 }}
                >
                  <Print />
                </Button>
              </Tooltip>
              <Tooltip title='Delete' placement='bottom'>
                <Popconfirm
                  title='Are you sure you want to delete the selected item?'
                  onConfirm={() => {
                    // this.handleDeleteRow(row)
                  }}
                >
                  <Button
                    size='sm'
                    onClick={() => {
                      handlePrint(row)
                    }}
                    justIcon
                    color='danger'
                    style={{ marginRight: 0 }}
                  >
                    <Delete />
                  </Button>
                </Popconfirm>
              </Tooltip>
            </React.Fragment>
          )
        },
      },
    ],
  }

  return <CommonTableGrid type='PatientDepositDetails' {...configs} />
}

export default DepositGrid
