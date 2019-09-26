import React, { PureComponent } from 'react'
import moment from 'moment'
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

  editRow = (row, isDeposit) => {
    const { dispatch, deposit } = this.props
    const { list } = deposit

    dispatch({
      type: 'deposit/updateState',
      payload: {
        entity: list.find((o) => o.id === row.id),
      },
    })

    this.setState({
      showDepositRefundModal: true,
      isDeposit: isDeposit,
    })
  }

  tableParas = {
    columns: [
      { name: 'patientName', title: 'Patient Name' },
      { name: 'accountNo', title: 'Account No' },
      { name: 'balance', title: 'Balance' },
      { name: 'lastTxnDate', title: 'Last Transaction' },
      { name: 'action', title: 'Action' },
    ],
    columnExtensions: [
      {
        columnName: 'balance',
        type: 'number',
        currency: true,
      },
      {
        columnName: 'lastTxnDate',
        type: 'date',
        format: { dateFormatLong },
      },
      {
        columnName: 'Action',
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

  componentDidMount () {
    this.props.dispatch({
      type: 'deposit/query',
    })
  }

  toggleModal = () => {
    this.setState((prevState) => ({
      showDepositRefundModal: !prevState.showDepositRefundModal,
    }))
  }

  render () {
    const { isDeposit, showDepositRefundModal } = this.state
    const { deposit: { list }, dispatch } = this.props
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
        >
          <Modal isDeposit={isDeposit} />
        </CommonModal>
      </React.Fragment>
    )
  }
}

export default Grid
