import React, { PureComponent, memo } from 'react'
import { formatMessage } from 'umi/locale'
import Search from '@material-ui/icons/Search'
import { findGetParameter } from '@/utils/utils'
import moment from 'moment'
import { standardRowHeight } from 'mui-pro-jss'
import Printer from '@material-ui/icons/Print'
import { ReportViewer } from '@/components/_medisys'
import Authorized from '@/utils/Authorized'
import {
  GridContainer,
  GridItem,
  FastField,
  TextField,
  CodeSelect,
  withFormikExtend,
  DateRangePicker,
  ProgressButton,
  Tooltip,
  Checkbox,
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
    // const { setFieldValue } = props
  }

  // componentDidMount = () => {
  //   setTimeout(() => {
  //     this.searchResult()
  //   }, 100)
  // }

  openReportViewer = () => {
    this.setState({ reportViewerOpen: true })
  }

  closeReportViewer = () => {
    this.setState({ reportViewerOpen: false })
  }

  addDepositRefund = async (isDeposit) => {
    const { dispatch, patient: { deposit } } = this.props
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
          showModal: true,
          entity: {},
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
    const patientId = Number(findGetParameter('pid'))
    return (
      <React.Fragment>
        <GridItem md={3}>
          <FastField
            name='depositTransactionTypeFK'
            render={(args) => (
              <CodeSelect
                label='Type'
                {...args}
                code='LTDepositTransactionType'
                mode='multiple'
                onChange={this.props.handleTypeChange}
              />
            )}
          />
        </GridItem>

        <GridItem md={9} style={{ alignSelf: 'center', textAlign: 'right' }}>
          <Button size='lg' onClick={this.openReportViewer} color='primary'>
            <Printer /> Transaction Details
          </Button>
          <Authorized authority='deposit.deposit'>
            <Button
              size='lg'
              onClick={() => {
                this.addDepositRefund(true)
              }}
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
          observe='Deposit'
          showFooter={false}
          bodyNoPadding
        >
          <Modal isDeposit={isDeposit} />
        </CommonModal>

        <CommonModal
          open={this.state.reportViewerOpen}
          onClose={this.closeReportViewer}
          title='Patient Deposit Transaction Details'
          maxWidth='lg'
        >
          <ReportViewer reportID={53} reportParameters={{ patientId }} />
        </CommonModal>
      </React.Fragment>
    )
  }
}

export default FilterBar
