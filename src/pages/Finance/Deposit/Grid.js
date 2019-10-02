import React, { PureComponent } from 'react'
import { Table } from '@devexpress/dx-react-grid-material-ui'

import { Tooltip, withStyles } from '@material-ui/core'
import { PanTool, Payment } from '@material-ui/icons'
import Modal from './Modal'

import {
  Button,
  CommonModal,
  CommonTableGrid,
  dateFormatLong,
} from '@/components'

class Grid extends PureComponent {
  state = {
    showDepositRefundModal: false,
  }

  tableParas = {
    columns: [
      { name: 'name', title: 'Patient Name' },
      { name: 'patientAccountNo', title: 'Account No' },
      { name: 'balance', title: 'Balance' },
      { name: 'lastTransactionDate', title: 'Last Transaction' },
      { name: 'action', title: 'Action' },
    ],
    columnExtensions: [
      {
        columnName: 'balance',
        type: 'number',
        currency: true,
      },
      {
        columnName: 'lastTransactionDate',
        type: 'date',
        format: { dateFormatLong },
      },
      {
        columnName: 'action',
        width: 110,
        align: 'center',
        sortingEnabled: false,
      },
    ],
    ActionProps: {
      TableCellComponent: ({ column, row, dispatch, classes, ...props }) => {
        // console.log(this)
        if (column.name === 'action') {
          return (
            <Table.Cell {...props}>
              <Tooltip title='Deposit' placement='bottom'>
                <Button
                  size='sm'
                  onClick={() => {
                    this.editRow(row, true)
                  }}
                  justIcon
                  round
                  color='primary'
                  style={{ marginRight: 5 }}
                >
                  <PanTool />
                </Button>
              </Tooltip>
              <Tooltip title='Refund' placement='bottom'>
                <Button
                  size='sm'
                  disabled={row.balance < 1}
                  onClick={() => {
                    this.editRow(row, false)
                  }}
                  justIcon
                  round
                  color='primary'
                  style={{ marginRight: 5 }}
                >
                  <Payment />
                </Button>
              </Tooltip>
            </Table.Cell>
          )
        }
        return <Table.Cell {...props} />
      },
    },

    leftColumns: [],
  }

  editRow = async (row, isDeposit) => {
    const { dispatch, deposit } = this.props
    const { list } = deposit
    console.log({ row })

    if (row.patientDepositFK > 0) {
      await dispatch({
        type: 'deposit/queryOne',
        payload: {
          id: row.patientDepositFK,
        },
      })
    } else {
      dispatch({
        type: 'deposit/updateState',
        payload: {
          showModal: true,
          entity: list.find((o) => o.id === row.id),
        },
      })
    }

    this.setState({
      showDepositRefundModal: true,
      isDeposit,
    })
  }

  toggleModal = () => {
    this.setState((prevState) => ({
      showDepositRefundModal: !prevState.showDepositRefundModal,
    }))
  }

  render () {
    const { isDeposit, showDepositRefundModal } = this.state
    return (
      <React.Fragment>
        <CommonTableGrid type='deposit' {...this.tableParas} />
        <CommonModal
          open={showDepositRefundModal}
          title={isDeposit ? 'Deposit' : 'Refund'}
          onClose={this.toggleModal}
          onConfirm={this.toggleModal}
          maxWidth='sm'
          showFooter={false}
          bodyNoPadding
        >
          <Modal isDeposit={isDeposit} />
        </CommonModal>
      </React.Fragment>
    )
  }
}

export default Grid
