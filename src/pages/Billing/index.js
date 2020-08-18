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
// common utils
import { roundTo } from '@/utils/utils'
import { INVOICE_PAYER_TYPE } from '@/utils/constants'
import Authorized from '@/utils/Authorized'
// sub component
import PatientBanner from '@/pages/PatientDashboard/Banner'
import DispenseDetails from '@/pages/Dispense/DispenseDetails/WebSocketWrapper'
import { ReportsOnCompletePaymentOption } from '@/utils/codes'
import ApplyClaims from './refactored/newApplyClaims'
import InvoiceSummary from './components/InvoiceSummary'
import SchemeValidationPrompt from './components/SchemeValidationPrompt'
import { getDrugLabelPrintData } from '../Shared/Print/DrugLabelPrint'
// page utils
import {
  constructPayload,
  validateApplySchemesWithPatientSchemes,
} from './utils'
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

// @Authorized.Secured('queue.dispense.makepayment')
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
    clinicSettings,
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
    clinicSettings: clinicSettings.settings,
  }),
)
@withFormikExtend({
  // authority: [
  //   'queue.dispense.makepayment',
  // ],
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
@Authorized.Secured('queue.dispense.makepayment')
class Billing extends Component {
  state = {
    showReport: false,
    reportPayload: {
      reportID: undefined,
      reportParameters: undefined,
    },
    showAddPaymentModal: false,
    showSchemeValidationPrompt: false,
    isEditing: false,
    submitCount: 0,
    schemeValidations: {
      patient: [],
      billing: [],
    },
    showDrugLabelSelection: false,
    selectedDrugs: [],
    isExistingOldPayerItem: false,
  }

  componentWillMount () {
    const { billing, history, dispatch } = this.props
    const { patientID } = billing
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
    this.props.dispatch({
      type: 'dispense/updateState',
      payload: {
        entity: null,
      },
    })
  }

  onPrintRef = (ref) => {
    this.childOnPrintRef = ref
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

  printAfterComplete = async () => {
    let settings = JSON.parse(localStorage.getItem('clinicSettings'))
    const {
      autoPrintOnCompletePayment,
      autoPrintReportsOnCompletePayment,
    } = settings
    if (autoPrintOnCompletePayment) {
      await this.onExpandDispenseDetails()

      const { values, dispense } = this.props
      const { prescription = [] } = dispense.entity
      const { invoice, invoicePayment } = values
      this.setState({
        selectedDrugs: prescription.map((x) => {
          return { ...x, no: 1, selected: true }
        }),
      })
      let reportsOnCompletePayment = autoPrintReportsOnCompletePayment.split(
        ',',
      )
      let printData = []

      if (
        reportsOnCompletePayment.indexOf(
          ReportsOnCompletePaymentOption.Invoice,
        ) > -1
      ) {
        if (invoice) {
          printData.push({
            ReportId: 15,
            Copies: 1,
            DocumentName: 'Invoice',
            ReportParam: `${JSON.stringify({ InvoiceID: invoice.id })}`,
          })
        }
      }
      if (
        reportsOnCompletePayment.indexOf(
          ReportsOnCompletePaymentOption.Receipt,
        ) > -1
      ) {
        if (invoicePayment && invoicePayment.length > 0) {
          let payments = invoicePayment.filter(
            (payment) => !payment.isCancelled && !payment.isDeleted,
          )
          if (payments && payments.length > 0) {
            printData = printData.concat(
              payments.map((payment) => ({
                ReportId: 29,
                DocumentName: 'Receipt',
                Copies: 1,
                ReportParam: `${JSON.stringify({
                  InvoicePaymentId: payment.id,
                })}`,
              })),
            )
          }
        }
      }
      if (
        reportsOnCompletePayment.indexOf(
          ReportsOnCompletePaymentOption.DrugLabel,
        ) > -1
      ) {
        if (printData && printData.length > 0) {
          const token = localStorage.getItem('token')
          printData = printData.map((item) => ({
            ...item,
            Token: token,
            BaseUrl: process.env.url,
          }))
          await this.childOnPrintRef({
            type: 1,
            printData,
            printAllDrugLabel: true,
          })
        }
      }
    }
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
        const defaultCallback = async () => {
          if (visitStatus === 'COMPLETED') {
            notification.success({
              message: 'Billing Completed',
            })
            await this.printAfterComplete()

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
          await defaultCallback()
        }
      }
    } catch (error) {
      console.error(error)
    }
  }

  onCloseReport = () => {
    this.setState({
      showReport: false,
      reportPayload: {
        reportID: undefined,
        reportParameters: undefined,
      },
    })
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

  onExpandDispenseDetails = async () => {
    const { dispense } = this.props

    if (!dispense.entity) {
      await this.props.dispatch({
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
    const { dispatch, values, setFieldValue } = this.props
    await setFieldValue('mode', 'save')
    await setFieldValue('visitStatus', 'COMPLETED')

    // check if invoice is OVERPAID and prompt user for confirmation
    const { invoice, invoicePayer = [] } = values
    const { outstandingBalance = 0 } = invoice
    if (
      outstandingBalance < 0 ||
      invoicePayer.find((ip) => ip.payerOutstanding < 0)
    ) {
      return dispatch({
        type: 'global/updateState',
        payload: {
          openConfirm: true,
          openConfirmTitle: '',
          openConfirmText: 'Confirm',
          openConfirmContent:
            'Invoice is overpaid. Confirm to complete billing?',
          onConfirmSave: this.upsertBilling,
        },
      })
    }
    return this.upsertBilling()
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

  onPrinterClick = (type, itemID, copayerID) => {
    switch (type) {
      case 'Payment':
        this.onShowReport(29, { InvoicePaymentId: itemID })
        break
      case 'TaxInvoice':
        this.onPrintInvoice(copayerID)
        break
      default:
        break
    }
  }

  onPrintInvoice = (copayerID) => {
    const { values, dispatch } = this.props
    const { invoicePayer } = values
    const modifiedOrNewAddedPayer = invoicePayer.filter((payer) => {
      if (payer.id === undefined && payer.isCancelled) return false
      if (payer.id) return payer.isModified
      return true
    })
    let parametrPaload
    if (copayerID) {
      parametrPaload = {
        InvoiceId: values.invoice ? values.invoice.id : '',
        CopayerId: copayerID,
      }
    } else {
      parametrPaload = {
        InvoiceId: values.invoice ? values.invoice.id : '',
      }
    }
    console.log('parametrPaload', parametrPaload)
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

              this.onShowReport(15, parametrPaload)
            }
            this.upsertBilling(callback)
          },
        },
      })
    } else {
      this.onShowReport(15, parametrPaload)
    }
  }

  onPrintInvoiceClick = () => {
    this.onPrintInvoice(undefined)
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

  handleDrugLabelClick = () => {
    const { dispense } = this.props
    const { prescription = [] } = dispense.entity
    this.setState((prevState) => {
      return {
        showDrugLabelSelection: !prevState.showDrugLabelSelection,
        selectedDrugs: prescription.map((x) => {
          return { ...x, no: 1, selected: true }
        }),
      }
    })
  }

  handleDrugLabelSelectionClose = () => {
    this.setState((prevState) => {
      return {
        showDrugLabelSelection: !prevState.showDrugLabelSelection,
      }
    })
  }

  handleDrugLabelSelected = (itemId, selected) => {
    this.setState((prevState) => ({
      selectedDrugs: prevState.selectedDrugs.map(
        (drug) => (drug.id === itemId ? { ...drug, selected } : { ...drug }),
      ),
    }))
    this.props.dispatch({ type: 'global/incrementCommitCount' })
  }

  handleDrugLabelNoChanged = (itemId, no) => {
    this.setState((prevState) => ({
      selectedDrugs: prevState.selectedDrugs.map(
        (drug) => (drug.id === itemId ? { ...drug, no } : { ...drug }),
      ),
    }))
    this.props.dispatch({ type: 'global/incrementCommitCount' })
  }

  onShowReport = (reportID, reportParameters) => {
    this.setState({
      showReport: true,
      reportPayload: {
        reportID,
        reportParameters,
      },
    })
  }

  handleIsExistingOldPayerItem = (isExistingOldPayerItem) => {
    this.setState({ isExistingOldPayerItem })
  }

  render () {
    const {
      showReport,
      reportPayload,
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
      clinicSettings,
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
      sessionInfo,
      user,
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
                        onDrugLabelClick={this.handleDrugLabelClick}
                        showDrugLabelSelection={
                          this.state.showDrugLabelSelection
                        }
                        onDrugLabelSelectionClose={
                          this.handleDrugLabelSelectionClose
                        }
                        onDrugLabelSelected={this.handleDrugLabelSelected}
                        onDrugLabelNoChanged={this.handleDrugLabelNoChanged}
                        selectedDrugs={this.state.selectedDrugs}
                        onPrintRef={this.onPrintRef}
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
                  onPrinterClick={this.onPrinterClick}
                  saveBilling={this.handleSaveBillingClick}
                  fromBilling
                  handleIsExistingOldPayerItem={
                    this.handleIsExistingOldPayerItem
                  }
                  clinicSettings={clinicSettings}
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
          <GridItem md={4} style={{ paddingRight: 0 }}>
            <React.Fragment>
              <div className={classes.paymentButton}>
                <Button
                  color='info'
                  onClick={this.backToDispense}
                  disabled={
                    this.state.isEditing ||
                    values.id === undefined ||
                    values.invoicePayer.find((payer) =>
                      (payer.invoicePayment || [])
                        .find((payment) => !payment.isCancelled),
                    )
                  }
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
                  disabled={
                    this.state.isEditing ||
                    values.id === undefined ||
                    this.state.isExistingOldPayerItem
                  }
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
          onClose={this.onCloseReport}
          title='Invoice'
          maxWidth='lg'
        >
          <ReportViewer
            showTopDivider={false}
            reportID={reportPayload.reportID}
            reportParameters={reportPayload.reportParameters}
          />
        </CommonModal>
      </LoadingWrapper>
    )
  }
}

export default withStyles(styles, { name: 'BillingScreen' })(Billing)
