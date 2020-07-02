import React, { PureComponent } from 'react'
import { connect } from 'dva'
import $ from 'jquery'
import Yup from '@/utils/yup'
import Refresh from '@material-ui/icons/Refresh'
import moment from 'moment'
import { findGetParameter, roundTo } from '@/utils/utils'
import { ReportViewer } from '@/components/_medisys'

import {
  GridContainer,
  GridItem,
  CardContainer,
  Card,
  Button,
  notification,
  FastField,
  Field,
  OutlinedTextField,
  withFormikExtend,
  Tooltip,
  RichEditor,
  NumberInput,
  CommonModal,
} from '@/components'
import { withStyles, TextField } from '@material-ui/core'
import withWebSocket from '@/components/Decorator/withWebSocket'

import depositModel from '@/pages/Finance/Deposit/models/deposit'
import DepositGrid from './DepositGrid'
import FilterBar from './FilterBar'

window.g_app.replaceModel(depositModel)

const styles = () => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    height: 'calc(100vh - 110px)',
  },
  summaryText: {
    textAlign: 'right',
    fontSize: 'inherit',
    color: 'inherit',
    fontWeight: 500,
    width: 200,
    border: 'transparent',
  },
})

// window.g_app.replaceModel(model)

@connect(({ patient, user }) => ({
  patient,
  user,
}))
class PatientDeposit extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      reportViewerOpen: false,
      reportID: undefined,
      reportParameters: {},
      selectedTypeIds: [
        -99,
      ],
    }
  }

  componentDidMount () {
    setTimeout(() => {
      this.searchResult()
    }, 10)
  }

  searchResult = () => {
    const { dispatch } = this.props
    const patientId = Number(findGetParameter('pid'))

    dispatch({
      type: 'patient/queryDeposit',
      payload: {
        id: patientId,
      },
    })
  }

  toggleReportViewer = (reportID, reportParameters = {}) => {
    this.setState((prevState) => ({
      reportViewerOpen: !prevState.reportViewerOpen,
      reportID,
      reportParameters,
    }))
  }

  handlePrintReceipt = (row) => {
    // const { transactionTypeFK } = row
    // const isDeposit = transactionTypeFK === 1 //
    const reportID = 58
    this.toggleReportViewer(reportID, { transactionId: row.id })
  }

  handleDeleteRow = async (row) => {
    await this.props.dispatch({
      type: 'deposit/deleteTransaction',
      payload: {
        id: row.id,
      },
    })
    this.searchResult()
  }

  handleTypeChange = (opt) => {
    this.setState({
      selectedTypeIds:
        !opt || opt.length === 0
          ? [
              -99,
            ]
          : opt,
    })
  }

  render () {
    const { dispatch, user, patient: { deposit }, classes } = this.props
    const { selectedTypeIds } = this.state
    const patientId = Number(findGetParameter('pid'))

    let transactionList = []
    let totalAmount = 0
    let refundableAmount = 0
    if (deposit && deposit.patientDepositTransaction) {
      const { patientDepositTransaction } = deposit
      const sumReducer = (p, n) => {
        return p + n
      }
      totalAmount = roundTo(
        patientDepositTransaction
          .map((row) => row.amount)
          .reduce(sumReducer, 0),
      )
      refundableAmount = roundTo(deposit.balance)

      patientDepositTransaction.map((row) => {
        if (
          selectedTypeIds.includes(row.transactionTypeFK) ||
          selectedTypeIds.includes(-99)
        ) {
          transactionList.push({ ...row, refundableBalance: refundableAmount })
        }
      })
    }
    const amountProps = {
      showZero: true,
      noUnderline: true,
      currency: true,
      rightAlign: true,
      text: true,
      fullWidth: false,
    }
    return (
      <React.Fragment>
        <CardContainer hideHeader size='sm'>
          <GridContainer>
            <FilterBar
              {...this.props}
              refresh={this.searchResult}
              handleTypeChange={this.handleTypeChange}
            />
          </GridContainer>
          <GridContainer style={{ marginTop: 20 }}>
            <GridItem md={12}>
              <DepositGrid
                transactionList={transactionList}
                handlePrint={this.handlePrintReceipt}
                handleDeleteRow={this.handleDeleteRow}
              />
            </GridItem>

            <GridItem md={2} />
            <GridItem md={10} style={{ marginTop: 20 }}>
              <GridContainer>
                <GridItem md={12} style={{ textAlign: 'right' }}>
                  <span className={classes.summaryText}>Balance:</span>
                  <NumberInput
                    {...amountProps}
                    style={{ width: 100 }}
                    value={totalAmount}
                  />
                </GridItem>
                <GridItem md={12} style={{ textAlign: 'right' }}>
                  <span className={classes.summaryText}>
                    Refundable Balance:
                  </span>
                  <NumberInput
                    {...amountProps}
                    style={{ width: 100 }}
                    value={refundableAmount}
                  />
                </GridItem>
              </GridContainer>
            </GridItem>
          </GridContainer>
        </CardContainer>

        <CommonModal
          open={this.state.reportViewerOpen}
          onClose={this.toggleReportViewer}
          title='Patient Deposit Transaction Details'
          maxWidth='lg'
        >
          <ReportViewer
            reportID={this.state.reportID}
            reportParameters={this.state.reportParameters}
          />
        </CommonModal>
      </React.Fragment>
    )
  }
}

export default withStyles(styles, { withTheme: true })(
  withWebSocket()(PatientDeposit),
)
