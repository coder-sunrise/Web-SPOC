import React, { PureComponent } from 'react'
import { connect } from 'dva'
import Authorized from '@/utils/Authorized'
import { findGetParameter, roundTo } from '@/utils/utils'
import { ReportViewer } from '@/components/_medisys'

import {
  GridContainer,
  GridItem,
  CardContainer,
  NumberInput,
  CommonModal,
} from '@/components'
import { withStyles, TextField } from '@material-ui/core'
import withWebSocket from '@/components/Decorator/withWebSocket'

import depositModel from '@/pages/Finance/Deposit/models/deposit'
import DeleteConfirm from './DeleteConfirm'
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
      showDeleteConfirmation: false,
      deletingRow: {},
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
    dispatch({
      type: 'deposit/reset',
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
    this.setState({ showDeleteConfirmation: true, deletingRow: row })
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

  closeDeleteConfirmationModal = () =>
    this.setState({ showDeleteConfirmation: false, deletingRow: undefined })

  confirmDelete = async (reason) => {
    const { deletingRow } = this.state

    await this.props.dispatch({
      type: 'deposit/deleteTransaction',
      payload: {
        id: deletingRow.id,
        reason,
      },
    })
    this.setState({ showDeleteConfirmation: false, deletingRow: undefined })
    this.searchResult()
  }

  render () {
    const { dispatch, user, patient: { deposit }, classes } = this.props
    const { selectedTypeIds, showDeleteConfirmation } = this.state

    let transactionList = []
    let totalAmount = 0
    let refundableAmount = 0
    if (deposit && deposit.patientDepositTransaction) {
      const { patientDepositTransaction } = deposit

      totalAmount = roundTo(
        patientDepositTransaction
          .filter((f) => !f.isCancelled)
          .map((row) => row.amount)
          .reduce((p, c) => p + c, 0),
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
      <Authorized authority='patientdatabase.patientprofiledetails.patienthistory.deposit'>
        {({ rights: depositAccessRight }) => (
          <Authorized.Context.Provider
            value={{
              rights:
                depositAccessRight === 'readwrite' ||
                depositAccessRight === 'enable'
                  ? 'enable'
                  : depositAccessRight,
            }}
          >
            <React.Fragment>
              <CardContainer hideHeader size='sm'>
                <GridContainer>
                  <FilterBar
                    {...this.props}
                    refresh={this.searchResult}
                    disabled={depositAccessRight !== 'enable'}
                    refundableAmount={refundableAmount}
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
                open={showDeleteConfirmation}
                title='Delete Deposit'
                onConfirm={this.closeDeleteConfirmationModal}
                onClose={this.closeDeleteConfirmationModal}
                maxWidth='sm'
              >
                <DeleteConfirm
                  onClose={this.closeDeleteConfirmationModal}
                  handleConfirm={this.confirmDelete}
                />
              </CommonModal>

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
          </Authorized.Context.Provider>
        )}
      </Authorized>
    )
  }
}

export default withStyles(styles, { withTheme: true })(
  withWebSocket()(PatientDeposit),
)
