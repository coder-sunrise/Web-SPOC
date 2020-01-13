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
// import ApplyClaims from './components/ApplyClaims'
import ApplyClaims from './refactored/newApplyClaims'
import InvoiceSummary from './components/InvoiceSummary'
import SchemeValidationPrompt from './components/SchemeValidationPrompt'
// utils
import {
  constructPayload,
  validateApplySchemesWithPatientSchemes,
} from './utils'
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

@connect(
  ({
    global,
    codetable,
    queueLog,
    billing,
    user,
    dispense,
    loading,
    patient,
  }) => ({
    billing,
    dispense,
    loading: loading.models.billing,
    dispenseLoading: loading.models.dispense,
    patient: patient.entity || patient.default,
    user: user.data,
    sessionInfo: queueLog.sessionInfo,
    ctcopaymentscheme: codetable.copaymentscheme || [],
    ctschemetype: codetable.ctschemetype || [],
    commitCount: global.commitCount,
  }),
)
@withFormikExtend({
  notDirtyDuration: 3,
  displayName: 'BillingForm',
  enableReinitialize: true,
  mapPropsToValues: ({ billing }) => {
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
        const values = {
          ...billing.default,
          ...billing.entity,
          invoice: {
            ...billing.entity.invoice,
          },
          finalClaim,
          finalPayable,
          visitId: billing.visitID,
          visitPurposeFK,
        }

        return values
      }
    } catch (error) {
      console.log({ error })
    }
    return { ...billing.default, visitId: billing.visitID }
  },
})
class Billing extends Component {
  state = {
    showReport: false,
    showAddPaymentModal: false,
    showSchemeValidationPrompt: false,
    isEditing: false,
    submitCount: 0,
    schemeValidations: {
      patient: [],
      billing: [],
    },
  }

  componentDidMount () {
    const { history, dispatch } = this.props
    const { query } = history.location
    dispatch({
      type: 'codetable/fetchCodes',
      payload: {
        code: 'copaymentscheme',
      },
    })
    dispatch({
      type: 'codetable/fetchCodes',
      payload: {
        code: 'ctschemetype',
      },
    })
    if (query.vid)
      dispatch({
        type: 'billing/query',
        payload: {
          id: query.vid,
        },
      })
  }

  componentWillUnmount () {
    this.props.dispatch({
      type: 'billing/updateState',
      payload: {
        entity: null,
      },
    })
  }

  validateSchemesWithPatientProfile = (invoicePayers = []) => {
    const { doesNotMatch, schemes } = validateApplySchemesWithPatientSchemes({
      ...this.props,
      invoicePayers,
    })
    this.setState({
      schemeValidations: schemes,
      showSchemeValidationPrompt: doesNotMatch,
    })
    return !doesNotMatch
  }

  upsertByPassValidation = () => {
    this.upsertBilling(null, true)
    this.toggleSchemeValidationPrompt()
  }

  upsertBilling = async (callback = null, noValidation = false) => {
    const { dispatch, values, resetForm, patient } = this.props
    const { visitStatus, invoicePayer = [] } = values
    try {
      const isSchemesValid = noValidation
        ? true
        : this.validateSchemesWithPatientProfile(invoicePayer)
      if (isSchemesValid) {
        const payload = constructPayload(values)
        const defaultCallback = () => {
          if (visitStatus === 'COMPLETED') {
            notification.success({
              message: 'Billing Completed',
            })
            router.push('/reception/queue')
          } else {
            notification.success({
              message: 'Billing Saved',
            })
            dispatch({
              type: 'patient/query',
              payload: { id: patient.id },
            })
            this.setState((preState) => ({
              submitCount: preState.submitCount + 1,
            }))
          }
          resetForm()
        }

        const saveResponse = await dispatch({
          type: 'billing/save',
          payload,
        })

        if (saveResponse) {
          if (callback) {
            callback()
            return
          }
          defaultCallback()
        }
      }
    } catch (error) {
      console.error(error)
    }
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

  shouldDisableSaveAndCompleteButton = () => {
    const { values } = this.props
    const { invoicePayer = [], invoice } = values
    if (invoice === null) return true
    if (invoicePayer.length === 0) return false

    return false
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
            const callback = () => {
              this.setState((preState) => ({
                submitCount: preState.submitCount + 1,
              }))
              this.toggleReport()
            }
            this.upsertBilling(callback)
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

  handleSaveBillingClick = () => {
    this.upsertBilling()
  }

  toggleSchemeValidationPrompt = () => {
    this.setState((preState) => ({
      showSchemeValidationPrompt: !preState.showSchemeValidationPrompt,
    }))
  }

  render () {
    const {
      showReport,
      showAddPaymentModal,
      showSchemeValidationPrompt,
      schemeValidations,
      submitCount,
    } = this.state
    const {
      classes,
      dispatch,
      values,
      dispense,
      loading,
      dispenseLoading,
      setFieldValue,
      setValues,
      patient,
      sessionInfo,
      user,
      commitCount,
      ctschemetype,
      ctcopaymentscheme,
    } = this.props
    const formikBag = {
      values,
      setFieldValue,
      setValues,
    }
    const commonProps = {
      patient,
      ctschemetype,
      ctcopaymentscheme,
    }
    return (
      <LoadingWrapper loading={loading} text='Getting billing info...'>
        <PatientBanner />
        <div className={classes.accordionContainer}>
          <LoadingWrapper linear loading={dispenseLoading}>
            <Accordion
              leftIcon
              expandIcon={<SolidExpandMore fontSize='large' />}
              onChange={this.onExpandDispenseDetails}
              collapses={[
                {
                  title: <h5 style={{ paddingLeft: 8 }}>Dispensing Details</h5>,
                  content: (
                    <div className={classes.dispenseContainer}>
                      <DispenseDetails
                        viewOnly
                        values={dispense.entity}
                        dispatch={this.props.dispatch}
                      />
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
              {values.id && (
                <ApplyClaims
                  handleIsEditing={this.handleIsEditing}
                  onResetClick={this.handleResetClick}
                  submitCount={submitCount}
                  dispatch={dispatch}
                  commitCount={commitCount}
                  {...formikBag}
                  {...commonProps}
                />
              )}
            </GridContainer>
            <GridContainer item md={4} justify='center' alignItems='flex-start'>
              <InvoiceSummary
                disabled={this.state.isEditing || values.id === undefined}
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
                    rowsMax={5}
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
                  disabled={this.state.isEditing || values.id === undefined}
                >
                  <ArrowBack />Dispense
                </Button>
                <Button
                  color='primary'
                  onClick={this.handleSaveBillingClick}
                  disabled={this.state.isEditing || values.id === undefined}
                >
                  Save Billing
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
          open={showSchemeValidationPrompt}
          title='Scheme Check'
          onClose={this.toggleSchemeValidationPrompt}
          onConfirm={this.upsertByPassValidation}
          cancelText='Cancel'
        >
          <SchemeValidationPrompt validation={schemeValidations} />
        </CommonModal>
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
              outstandingBalance: values.invoice.outstandingBalance,
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
