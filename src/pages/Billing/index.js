import React, { Component } from 'react'
import router from 'umi/router'
import { connect } from 'dva'
// material ui
import { Paper, withStyles } from '@material-ui/core'
import ArrowBack from '@material-ui/icons/ArrowBack'
import SolidExpandMore from '@material-ui/icons/ArrowDropDown'
// common components
import {
  Accordion,
  Button,
  CommonModal,
  GridContainer,
  GridItem,
  withFormikExtend,
  notification,
  FastField,
  OutlinedTextField,
} from '@/components'
import { AddPayment, LoadingWrapper, ReportViewer } from '@/components/_medisys'
// sub component
import PatientBanner from '@/pages/PatientDashboard/Banner'
import DispenseDetails from '@/pages/Dispense/DispenseDetails/PrintDrugLabelWrapper'
import ApplyClaims from './components/ApplyClaims'
import InvoiceSummary from './components/InvoiceSummary'
// utils
import { constructPayload } from './utils'
import { roundTo } from '@/utils/utils'
import { INVOICE_PAYER_TYPE } from '@/utils/constants'

// window.g_app.replaceModel(model)

const styles = (theme) => ({
  accordionContainer: {
    paddingTop: theme.spacing(1.5),
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
  paperContent: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    padding: theme.spacing(1),
  },
  paymentButton: {
    margin: theme.spacing(2),
    textAlign: 'right',
  },
  dispenseContainer: {
    // maxHeight: '40vh',
    // overflow: 'auto',
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(2),
  },
})

@connect(({ queueLog, billing, user, dispense, loading, patient }) => ({
  billing,
  dispense,
  loading,
  patient: patient.entity || patient.default,
  user: user.data,
  sessionInfo: queueLog.sessionInfo,
}))
@withFormikExtend({
  notDirtyDuration: 3,
  displayName: 'BillingForm',
  enableReinitialize: true,
  mapPropsToValues: ({ billing }) => {
    // console.log('map props to values')
    try {
      if (billing.entity) {
        const { invoicePayer = [], visitPurposeFK } = billing.entity
        const finalClaim = invoicePayer.reduce(
          (totalClaim, payer) =>
            totalClaim +
            payer.invoicePayerItem.reduce(
              (subtotal, item) => subtotal + item.claimAmount,
              0,
            ),
          0,
        )
        const finalPayable = roundTo(
          billing.entity.invoice.totalAftGst - finalClaim,
        )

        return {
          ...billing.default,
          ...billing.entity,
          finalClaim,
          finalPayable,
          visitId: billing.visitID,
          visitPurposeFK,
        }
      }
    } catch (error) {
      console.log({ error })
    }
    return { ...billing.default, visitId: billing.visitID }
  },
  handleSubmit: (values, { props, resetForm }) => {
    const { dispatch, patient } = props
    const { visitStatus } = values
    const payload = constructPayload(values)

    dispatch({
      type: 'billing/save',
      payload,
    }).then((response) => {
      if (response) {
        resetForm()
        if (visitStatus === 'COMPLETED') {
          notification.success({
            message: 'Billing completed',
          })
          router.push('/reception/queue')
        } else {
          dispatch({
            type: 'patient/query',
            payload: { id: patient.id },
          })
        }
      }
    })
  },
})
class Billing extends Component {
  state = {
    showReport: false,
    showAddPaymentModal: false,
    isEditing: false,
    submitCount: 0,
  }

  componentWillUnmount () {
    this.props.dispatch({
      type: 'billing/updateState',
      payload: {
        entity: null,
      },
    })
  }

  toggleReport = () => {
    this.setState((preState) => ({ showReport: !preState.showReport }))
  }

  backToDispense = () => {
    const { dispatch } = this.props
    dispatch({
      type: 'billing/backToDispense',
    })
  }

  toggleAddPaymentModal = () => {
    const { showAddPaymentModal } = this.state
    this.setState({ showAddPaymentModal: !showAddPaymentModal })
  }

  calculateOutstandingBalance = async (invoicePayment) => {
    const { values, setFieldValue } = this.props

    const totalPaid = invoicePayment.reduce((totalAmtPaid, payment) => {
      if (!payment.isCancelled) return totalAmtPaid + payment.totalAmtPaid
      return totalAmtPaid
    }, 0)
    const newOutstandingBalance = roundTo(values.finalPayable - totalPaid)
    await setFieldValue('invoice', {
      ...values.invoice,
      outstandingBalance: newOutstandingBalance,
    })
  }

  onExpandDispenseDetails = () => {
    const { dispense } = this.props
    if (!dispense.entity) {
      this.props.dispatch({
        type: 'billing/showDispenseDetails',
      })
    }
  }

  handleIsEditing = (editing) => {
    this.setState({ isEditing: editing })
  }

  upsertBilling = () => {
    this.setState((preState) => ({ submitCount: preState.submitCount + 1 }))
    this.props.handleSubmit()
  }

  shouldDisableSaveAndCompleteButton = () => {
    const { values } = this.props
    const { invoicePayer = [], invoice } = values
    if (invoice === null) return true
    if (invoicePayer.length === 0) return false

    return false
  }

  onSavePaymentClick = async () => {
    const { setFieldValue } = this.props
    await setFieldValue('mode', 'save')
    await setFieldValue('visitStatus', 'BILLING')
    this.upsertBilling()
  }

  onCompletePaymentClick = async () => {
    const { setFieldValue } = this.props
    await setFieldValue('mode', 'save')
    await setFieldValue('visitStatus', 'COMPLETED')
    this.upsertBilling()
  }

  onPrintReceiptClick = (invoicePaymentID) => {
    const { dispatch } = this.props
    dispatch({
      type: 'report/updateState',
      payload: {
        reportTypeID: 29,
        reportParameters: { isSaved: true, invoicePaymentID },
      },
    })
  }

  onPrintInvoiceClick = () => {
    const { values, dispatch } = this.props
    const { invoicePayer } = values
    const modifiedOrNewAddedPayer = invoicePayer.filter((payer) => {
      if (payer.id === undefined && payer.isCancelled) return false
      if (payer.id) return payer.isModified
      return true
    })
    if (modifiedOrNewAddedPayer.length > 0) {
      dispatch({
        type: 'global/updateState',
        payload: {
          openConfirm: true,
          openConfirmTitle: '',
          openConfirmText: 'Confirm',
          openConfirmContent: `Save changes and print invoice?`,
          onConfirmSave: () => {
            const payload = constructPayload({
              ...values,
              visitStatus: 'BILLING',
            })
            dispatch({
              type: 'billing/save',
              payload,
            }).then((response) => {
              if (response) {
                this.setState((preState) => ({
                  submitCount: preState.submitCount + 1,
                }))
                this.toggleReport()
              }
            })
          },
        },
      })
    } else this.toggleReport()
  }

  handleAddPayment = async (payment) => {
    const { values, setValues } = this.props
    const { outstandingBalance, ...rest } = payment
    const invoicePayment = [
      ...values.invoicePayment.filter((item) => item.id),
      rest,
    ]
    const _newValues = {
      ...values,
      invoicePayment,
      mode: 'save',
      visitStatus: 'BILLING',
    }
    await setValues(_newValues)
    await this.calculateOutstandingBalance(invoicePayment)

    this.toggleAddPaymentModal()
    this.upsertBilling()
  }

  handleDeletePayment = async (id) => {
    const { values, setValues, user } = this.props
    const { invoicePayment } = values
    let _newInvoicePayment = [
      ...invoicePayment,
    ]
    if (id === undefined) {
      _newInvoicePayment = invoicePayment.filter(
        (payment) => payment.id !== undefined,
      )
    } else {
      _newInvoicePayment = invoicePayment.map(
        (payment) =>
          payment.id === id
            ? {
                ...payment,
                isCancelled: true,
                cancelDate: new Date(),
                cancelByUserFK: user.id,
              }
            : { ...payment },
      )
    }
    // await setFieldValue('invoicePayment', _newInvoicePayment)
    const _newValues = {
      ...values,
      invoicePayment: _newInvoicePayment,
      mode: 'save',
      visitStatus: 'BILLING',
    }
    await setValues(_newValues)
    await this.calculateOutstandingBalance(_newInvoicePayment)
    this.upsertBilling()
  }

  handleResetClick = () => {
    const { dispatch, values } = this.props

    dispatch({
      type: 'billing/query',
      payload: { id: values.visitId },
    }).then((response) => {
      if (response) {
        this.setState((preState) => ({
          submitCount: preState.submitCount + 1,
        }))
      }
    })
  }

  render () {
    const { showReport, showAddPaymentModal, submitCount } = this.state
    const {
      classes,
      dispatch,
      values,
      dispense,
      loading,
      setFieldValue,
      setValues,
      patient,
      sessionInfo,
      user,
    } = this.props
    const formikBag = {
      values,
      setFieldValue,
      setValues,
    }
    return (
      <LoadingWrapper loading={loading.global} text='Getting billing info...'>
        <PatientBanner />
        <div className={classes.accordionContainer}>
          <LoadingWrapper
            linear
            loading={loading.effects['dispense/initState']}
          >
            <Accordion
              leftIcon
              expandIcon={<SolidExpandMore fontSize='large' />}
              onChange={this.onExpandDispenseDetails}
              collapses={[
                {
                  title: <h5 style={{ paddingLeft: 8 }}>Dispensing Details</h5>,
                  content: (
                    <div className={classes.dispenseContainer}>
                      <DispenseDetails viewOnly values={dispense.entity} />
                    </div>
                  ),
                },
              ]}
            />
          </LoadingWrapper>
        </div>

        <Paper className={classes.paperContent}>
          <GridContainer justify='center' alignItems='flex-start'>
            <GridContainer item md={8}>
              <ApplyClaims
                handleIsEditing={this.handleIsEditing}
                onResetClick={this.handleResetClick}
                submitCount={submitCount}
                dispatch={dispatch}
                {...formikBag}
              />
            </GridContainer>
            <GridContainer item md={4} justify='center' alignItems='flex-start'>
              <InvoiceSummary
                disabled={this.state.isEditing}
                handleAddPaymentClick={this.toggleAddPaymentModal}
                handleDeletePaymentClick={this.handleDeletePayment}
                handlePrintInvoiceClick={this.onPrintInvoiceClick}
                handlePrintReceiptClick={this.onPrintReceiptClick}
                {...formikBag}
              />
            </GridContainer>
          </GridContainer>
        </Paper>
        <GridContainer>
          <GridItem md={8}>
            <FastField
              name='invoice.invoiceRemark'
              render={(args) => {
                return (
                  <OutlinedTextField
                    label='Invoice Remarks'
                    multiline
                    maxLength={2000}
                    rowsMax={2}
                    rows={2}
                    {...args}
                  />
                )
              }}
            />
          </GridItem>
          <GridItem md={4}>
            <React.Fragment>
              <div className={classes.paymentButton}>
                <Button
                  color='info'
                  onClick={this.backToDispense}
                  disabled={this.state.isEditing}
                >
                  <ArrowBack />Dispense
                </Button>
                <Button
                  color='success'
                  disabled={this.state.isEditing || values.id === undefined}
                  onClick={this.onCompletePaymentClick}
                >
                  Complete Payment
                </Button>
              </div>
            </React.Fragment>
          </GridItem>
        </GridContainer>

        <CommonModal
          open={showAddPaymentModal}
          title='Add Payment'
          onClose={this.toggleAddPaymentModal}
          observe='AddPaymentForm'
          maxWidth='lg'
        >
          <AddPayment
            handleSubmit={this.handleAddPayment}
            invoicePayerName={patient.name}
            invoicePayment={values.invoicePayment}
            invoice={{
              ...values.invoice,
              outstandingBalance:
                values.invoice.patientOutstandingBalance ||
                values.invoice.outstandingBalance,
              payerTypeFK: INVOICE_PAYER_TYPE.PATIENT,
              // paymentReceivedDate: moment().formatUTC(false),
              paymentReceivedByUserFK: user.id,
              paymentCreatedBizSessionFK: sessionInfo.id,
              paymentReceivedBizSessionFK: sessionInfo.id,
              finalPayable: values.finalPayable,
              totalClaim: values.finalClaim,
            }}
          />
        </CommonModal>
        <CommonModal
          open={showReport}
          onClose={this.toggleReport}
          title='Invoice'
          maxWidth='lg'
        >
          <ReportViewer
            showTopDivider={false}
            reportID={15}
            reportParameters={{
              InvoiceID: values.invoice ? values.invoice.id : '',
            }}
          />
        </CommonModal>
      </LoadingWrapper>
    )
  }
}

export default withStyles(styles, { name: 'BillingScreen' })(Billing)
