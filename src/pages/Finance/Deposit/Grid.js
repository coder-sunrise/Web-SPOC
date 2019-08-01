import React, { PureComponent } from 'react'
import router from 'umi/router'
import moment from 'moment'
import { Table } from '@devexpress/dx-react-grid-material-ui'

import { Tooltip, withStyles } from '@material-ui/core'
import { PanTool, Payment, AccountCircle } from '@material-ui/icons'
import Modal from './Modal'
import { sleep, getAppendUrl } from '@/utils/utils'

import { Button, CommonModal, CommonTableGrid } from '@/components'

class Grid extends PureComponent {
  state = {
    showDepositRefundModal: false,
  }

  tableParas = {
    columns: [
      { name: 'depositNo', title: 'Reference No.' },
      { name: 'patientName', title: 'Patient Name' },
      { name: 'outstandingBalance', title: 'Balance' },
      { name: 'lastPayment', title: 'Refundable Amt.' },
      { name: 'amount', title: 'Last Transaction' },
      { name: 'officeNo', title: 'Office No.' },
      { name: 'Action', title: 'Action' },
    ],
    currencyColumns: [
      'outstandingBalance',
      'lastPayment',
    ],
    columnExtensions: [
      { columnName: 'Action', width: 110, align: 'center' },
      {
        columnName: 'outstandingBalance',
        type: 'number',
        currency: true,
      },
      {
        columnName: 'amount',
        type: 'number',
        currency: true,
      },
    ],
    ActionProps: {
      TableCellComponent: ({ column, row, dispatch, classes, ...props }) => {
        // console.log(this)
        if (column.name === 'Action') {
          return (
            <Table.Cell {...props}>
              <Tooltip title='Deposit' placement='bottom'>
                <Button
                  size='sm'
                  onClick={() => {
                    this.setState({
                      showDepositRefundModal: true,
                      isDeposit: true,
                    })
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
                  onClick={() => {
                    this.setState({
                      showDepositRefundModal: true,
                      isDeposit: false,
                    })
                  }}
                  justIcon
                  round
                  color='primary'
                  style={{ marginRight: 5 }}
                >
                  <Payment />
                </Button>
              </Tooltip>
              <Tooltip title='Detail' placement='bottom'>
                <Button
                  size='sm'
                  onClick={() => {
                    this.props.history.push(
                      getAppendUrl({
                        md: 'pt',
                        cmt: '1',
                        pid: row.Id,
                      }),
                    )
                  }}
                  justIcon
                  round
                  color='primary'
                  style={{ marginRight: 5 }}
                >
                  <AccountCircle />
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
        <CommonTableGrid rows={list} {...this.tableParas} />
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
