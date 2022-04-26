import React, { PureComponent } from 'react'
import { Table } from '@devexpress/dx-react-grid-material-ui'
import numeral from 'numeral'
import { Tooltip } from '@material-ui/core'

import Authorized from '@/utils/Authorized'
import {
  Button,
  CommonModal,
  CommonTableGrid,
  dateFormatLong,
  CustomInput,
} from '@/components'
import { currencyFormat, currencySymbol } from '@/utils/config'
import PatientDeposit from './PatientDeposit'
import Modal from './Modal'

class Grid extends PureComponent {
  state = {
    showDepositRefundModal: false,
    showPatientDeposit: false,
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
        render: row => {
          return (
            <CustomInput
              text
              currency
              value={
                row.balance || row.balance === 0
                  ? currencySymbol + numeral(row.balance).format(currencyFormat)
                  : undefined
              }
            />
          )
        },
      },
      {
        columnName: 'lastTransactionDate',
        type: 'date',
        sortingEnabled: false,
        format: dateFormatLong,
      },
      {
        columnName: 'action',
        width: 160,
        align: 'center',
        sortingEnabled: false,
      },
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
                    disabled={
                      !this.props.hasActiveSession || !row.patientIsActive
                    }
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
                    disabled={
                      row.balance <= 0 ||
                      !row.balance ||
                      !this.props.hasActiveSession ||
                      !row.patientIsActive
                    }
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
      const currentDeposit = list.find(o => o.id === row.id)
      const { patientProfileFK } = currentDeposit
      dispatch({
        type: 'deposit/updateState',
        payload: {
          showModal: true,
          entity: { patientProfileFK },
        },
      })
    }

    this.setState({
      showDepositRefundModal: true,
      isDeposit,
    })
  }

  toggleModal = () => {
    this.setState(prevState => ({
      showDepositRefundModal: !prevState.showDepositRefundModal,
    }))
  }

  togglePatientDepositModal = () => {
    this.setState(prevState => ({
      showPatientDeposit: !prevState.showPatientDeposit,
    }))
  }

  rowDoubleClick = row => {
    const { dispatch } = this.props
    const { patientProfileFK } = row
    dispatch({
      type: 'patient/query',
      payload: {
        id: patientProfileFK,
      },
    }).then(() => {
      this.togglePatientDepositModal()
    })
  }

  render() {
    const { isDeposit, showDepositRefundModal, showPatientDeposit } = this.state
    const { height } = this.props
    return (
      <Authorized authority='finance/deposit'>
        <React.Fragment>
          <CommonTableGrid
            type='deposit'
            onRowDoubleClick={this.rowDoubleClick}
            {...this.tableParas}
            TableProps={{
              height,
            }}
          />
          <CommonModal
            open={showDepositRefundModal}
            title={isDeposit ? 'Deposit' : 'Refund'}
            onClose={this.toggleModal}
            onConfirm={this.toggleModal}
            maxWidth='sm'
            observe='Deposit'
            showFooter={false}
            bodyNoPadding
            keepMounted={false}
          >
            <Modal isDeposit={isDeposit} />
          </CommonModal>
          <CommonModal
            open={showPatientDeposit}
            title='Patient Deposit'
            onClose={this.togglePatientDepositModal}
            onConfirm={this.togglePatientDepositModal}
            showFooter={false}
            keepMounted={false}
          >
            <PatientDeposit />
          </CommonModal>
        </React.Fragment>
      </Authorized>
    )
  }
}

export default Grid
