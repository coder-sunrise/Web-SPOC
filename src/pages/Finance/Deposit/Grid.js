import React, { PureComponent } from 'react'
import { Table } from '@devexpress/dx-react-grid-material-ui'
import numeral from 'numeral'
import { Tooltip, withStyles } from '@material-ui/core'
import { PanTool, Payment } from '@material-ui/icons'
import Modal from './Modal'
import Authorized from '@/utils/Authorized'
import {
  Button,
  CommonModal,
  CommonTableGrid,
  dateFormatLong,
  CustomInput,
} from '@/components'
import config from '@/utils/config'

const { currencyFormat, currencySymbol } = config

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
        sortBy: 'PatientDeposit.balance',
        align: 'right',
        render: (row) => {
          return (
            <CustomInput
              text
              currency
              value={
                row.balance || row.balance === 0 ? (
                  currencySymbol + numeral(row.balance).format(currencyFormat)
                ) : (
                  undefined
                )
              }
            />
          )
        },
      },
      {
        columnName: 'lastTransactionDate',
        type: 'date',
        sortingEnabled: false,
        format: { dateFormatLong },
      },
      {
        columnName: 'action',
        width: 160,
        align: 'center',
        sortingEnabled: false,
      },
      // {
      //   columnName: 'action',
      //   align: 'center',
      //   width: 500,
      //   sortingEnabled: false,
      //   render: (row) => {
      //     return (
      //       <Tooltip title='Edit Room'>
      //         <Button
      //           size='sm'
      //           onClick={() => {
      //             this.editRow(row)
      //           }}
      //           color='primary'
      //         >
      //           Deposit
      //         </Button>
      //       </Tooltip>
      //     )
      //   },
      // },
    ],
    ActionProps: {
      TableCellComponent: ({ column, row, dispatch, classes, ...props }) => {
        if (column.name === 'action') {
          return (
            <Table.Cell {...props} style={{ paddingRight: 0 }}>
              <Authorized authority='deposit.deposit'>
                <Tooltip title='Deposit' placement='bottom'>
                  <Button
                    size='sm'
                    onClick={() => {
                      this.editRow(row, true)
                    }}
                    color='primary'
                    style={{ marginRight: 5, width: 60, minWidth: 60 }}
                  >
                    {/* <PanTool /> */}
                    Deposit
                  </Button>
                </Tooltip>
              </Authorized>
              <Authorized authority='deposit.refund'>
                <Tooltip title='Refund' placement='bottom'>
                  <Button
                    size='sm'
                    disabled={row.balance <= 0}
                    onClick={() => {
                      this.editRow(row, false)
                    }}
                    color='primary'
                    style={{ marginRight: 5, width: 60, minWidth: 60 }}
                  >
                    {/* <Payment /> */}
                    Refund
                  </Button>
                </Tooltip>
              </Authorized>
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
          observe='Deposit'
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
