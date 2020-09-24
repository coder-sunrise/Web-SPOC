import React, { PureComponent } from 'react'
import { findGetParameter } from '@/utils/utils'
import Printer from '@material-ui/icons/Print'
import { ReportViewer } from '@/components/_medisys'
import Authorized from '@/utils/Authorized'
import {
  GridItem,
  FastField,
  CodeSelect,
  Button,
  CommonModal,
} from '@/components'
import Modal from '@/pages/Finance/Deposit/Modal'

class FilterBar extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      reportViewerOpen: false,
      showDepositRefundModal: false,
      isDeposit: true,
    }
  }

  openReportViewer = () => {
    this.setState({ reportViewerOpen: true })
  }

  closeReportViewer = () => {
    this.setState({ reportViewerOpen: false })
  }

  addDepositRefund = async (isDeposit) => {
    const { dispatch, patient: { deposit, entity } } = this.props
    const patientId = entity.id

    if (deposit && deposit.id > 0) {
      await dispatch({
        type: 'deposit/queryOne',
        payload: {
          id: deposit.id,
        },
      })
    } else {
      dispatch({
        type: 'deposit/updateState',
        payload: {
          entity: {
            patientProfileFK: patientId,
          },
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
    this.props.refresh()
  }

  render () {
    const { isDeposit, showDepositRefundModal } = this.state
    const {
      patient: { entity },
      disabled,
      refundableAmount = 0,
      selectedTypeIds,
      hasActiveSession,
    } = this.props
    const patientId = entity.id

    return (
      <React.Fragment>
        <GridItem md={4}>
          <CodeSelect
            label='Type'
            value={selectedTypeIds}
            code='LTDepositTransactionType'
            mode='multiple'
            style={{ width: 250 }}
            onChange={this.props.handleTypeChange}
          />
        </GridItem>

        <GridItem md={8} style={{ alignSelf: 'center', textAlign: 'right' }}>
          <Button size='lg' onClick={this.openReportViewer} color='primary'>
            <Printer /> Transaction Details
          </Button>
          <Authorized authority='deposit.deposit'>
            <Button
              size='lg'
              onClick={() => {
                this.addDepositRefund(true)
              }}
              disabled={disabled || !hasActiveSession}
              color='primary'
            >
              Deposit
            </Button>
          </Authorized>

          <Authorized authority='deposit.refund'>
            <Button
              size='lg'
              onClick={() => {
                this.addDepositRefund(false)
              }}
              disabled={disabled || refundableAmount <= 0 || !hasActiveSession}
              color='primary'
            >
              Refund
            </Button>
          </Authorized>
        </GridItem>
        <CommonModal
          open={showDepositRefundModal}
          title={isDeposit ? 'Deposit' : 'Refund'}
          onClose={this.toggleModal}
          onConfirm={this.toggleModal}
          maxWidth='sm'
          observe='PatientDeposit'
          showFooter={false}
          bodyNoPadding
          keepMounted={false}
        >
          <Modal isDeposit={isDeposit} />
        </CommonModal>

        <CommonModal
          open={this.state.reportViewerOpen}
          onClose={this.closeReportViewer}
          title='Patient Deposit Transaction Details'
          maxWidth='lg'
        >
          <ReportViewer reportID={57} reportParameters={{ patientId }} />
        </CommonModal>
      </React.Fragment>
    )
  }
}

export default FilterBar
