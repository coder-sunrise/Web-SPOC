import React, { Component } from 'react'
import { history } from 'umi'
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
  WarningSnackbar,
  Field,
  CheckboxGroup,
} from '@/components'
import { AddPayment, LoadingWrapper, ReportViewer } from '@/components/_medisys'
// common utils
import { roundTo } from '@/utils/utils'
import {
  INVOICE_PAYER_TYPE,
  PACKAGE_SIGNATURE_CHECK_OPTION,
} from '@/utils/constants'
import { VISIT_STATUS } from '@/pages/Reception/Queue/variables'
import Authorized from '@/utils/Authorized'
// sub component
import PatientBanner from '@/pages/PatientDashboard/Banner'
import DispenseDetails from '@/pages/Dispense/DispenseDetails/WebSocketWrapper'
import ViewPatientHistory from '@/pages/Consultation/ViewPatientHistory'
import {
  ReportsOnCompletePaymentOption,
  ReportsOnCompletePayment,
} from '@/utils/codes'
import Signature from '@/components/_medisys/Forms/Signature'
import ApplyClaims from './refactored/newApplyClaims'
import InvoiceSummary from './components/InvoiceSummary'
import SchemeValidationPrompt from './components/SchemeValidationPrompt'
import { getDrugLabelPrintData } from '../Shared/Print/DrugLabelPrint'
// page utils
import {
  constructPayload,
  validateApplySchemesWithPatientSchemes,
} from './utils'

const styles = theme => ({
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
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(2),
  },
})

const base64Prefix = 'data:image/jpeg;base64,'

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
    ctcopayer: codetable.ctcopayer || [],
    inventorymedication: codetable.inventorymedication || [],
    inventoryvaccination: codetable.inventoryvaccination || [],
    ctservice: codetable.ctservice || [],
    commitCount: global.commitCount,
    clinicSettings: clinicSettings.settings,
  }),
)
@withFormikExtend({
  notDirtyDuration: 3,
  displayName: 'BillingForm',
  enableReinitialize: true,
  mapPropsToValues: ({ billing, clinicSettings }) => {
    const { autoPrintReportsOnCompletePayment = '' } = clinicSettings
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
          autoPrintReportsOnCompletePayment: autoPrintReportsOnCompletePayment.split(
            ',',
          ),
        }

        return values
      }
    } catch (error) {
      console.log({ error })
    }
    return {
      ...billing.default,
      visitId: billing.visitID,
      autoPrintReportsOnCompletePayment: autoPrintReportsOnCompletePayment.split(
        ',',
      ),
    }
  },
})
@Authorized.Secured('queue.dispense.makepayment')
class Billing extends Component {
  constructor(props) {
    super(props)
    this.fetchCodeTables()
  }

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
    isUpdatedAppliedInvoicePayerInfo: false,
    isConsumedPackage: false,
  }

  componentWillUnmount() {
    this.props.dispatch({
      type: 'billing/updateState',
      payload: {
        entity: null,
        shouldRefreshOrder: false,
      },
    })
    this.props.dispatch({
      type: 'dispense/updateState',
      payload: {
        entity: null,
        shouldRefreshOrder: false,
      },
    })
  }

  fetchCodeTables = async () => {
    const { history, dispatch } = this.props
    const { query } = history.location
    await dispatch({
      type: 'codetable/fetchCodes',
      payload: {
        code: 'ctcopayer',
      },
    })
    await dispatch({
      type: 'codetable/fetchCodes',
      payload: {
        code: 'copaymentscheme',
      },
    })
    await dispatch({
      type: 'codetable/fetchCodes',
      payload: {
        code: 'ctschemetype',
      },
    })
    await dispatch({
      type: 'codetable/fetchCodes',
      payload: {
        code: 'ctservice',
      },
    })
    await dispatch({
      type: 'codetable/fetchCodes',
      payload: {
        code: 'inventoryvaccination',
      },
    })
    await dispatch({
      type: 'codetable/fetchCodes',
      payload: {
        code: 'inventorymedication',
      },
    })
    if (query.vid) {
      await dispatch({
        type: 'billing/query',
        payload: {
          id: query.vid,
        },
      }).then(response => {
        const { invoice } = response
        const { invoiceItems } = invoice

        if (invoiceItems && invoiceItems.length > 0) {
          const consumedItems = invoiceItems.filter(
            i => i.isPackage && i.packageConsumeQuantity > 0,
          )
          if (consumedItems.length > 0) {
            this.setState({
              isConsumedPackage: true,
            })
          }
        }
      })
    }
  }

  onPrintRef = ref => {
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

  printAfterComplete = async (autoPrintReportsOnCompletePayment = []) => {
    let settings = JSON.parse(localStorage.getItem('clinicSettings'))
    const { autoPrintOnCompletePayment } = settings
    if (autoPrintOnCompletePayment) {
      await this.onExpandDispenseDetails()

      const { values, dispense } = this.props
      const { prescription = [] } = dispense.entity
      const { invoice, invoicePayment } = values
      this.setState({
        selectedDrugs: prescription.map(x => {
          return { ...x, no: 1, selected: true }
        }),
      })
      let reportsOnCompletePayment = autoPrintReportsOnCompletePayment
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
            payment => !payment.isCancelled && !payment.isDeleted,
          )
          if (payments && payments.length > 0) {
            printData = printData.concat(
              payments.map(payment => ({
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

      const printDrugLabel =
        reportsOnCompletePayment.indexOf(
          ReportsOnCompletePaymentOption.DrugLabel,
        ) > -1
      if (!printDrugLabel) {
        this.setState({ selectedDrugs: [] })
      }

      if (printData && printData.length > 0) {
        const token = localStorage.getItem('token')
        printData = printData.map(item => ({
          ...item,
          Token: token,
          BaseUrl: process.env.url,
        }))
      }

      if (printData.length > 0 || printDrugLabel) {
        await this.childOnPrintRef({
          type: 1,
          printData,
          printAllDrugLabel: printDrugLabel,
        })
      }
    }
  }

  upsertBilling = async (callback = null, noValidation = false) => {
    const { dispatch, values, resetForm, patient } = this.props
    const {
      visitStatus,
      invoicePayer = [],
      autoPrintReportsOnCompletePayment = [],
    } = values
    try {
      const isSchemesValid = noValidation
        ? true
        : this.validateSchemesWithPatientProfile(invoicePayer)
      if (isSchemesValid) {
        const payload = constructPayload(values)
        const defaultCallback = async () => {
          if (visitStatus === VISIT_STATUS.COMPLETED) {
            notification.success({
              message: 'Billing Completed',
            })
            await this.printAfterComplete(autoPrintReportsOnCompletePayment)

            history.push('/reception/queue')
          } else {
            notification.success({
              message: 'Billing Saved',
            })
            dispatch({
              type: 'patient/query',
              payload: { id: patient.id },
            })
            this.setState(preState => ({
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
    const refreshOrder = this.showRefreshOrder()
    const { dispatch, billing } = this.props
    dispatch({
      type: 'billing/backToDispense',
    }).then(() => {
      if (refreshOrder) {
        dispatch({
          type: 'dispense/refresh',
          payload: billing.visitID,
        })
      }
    })
  }

  toggleAddPaymentModal = () => {
    const { showAddPaymentModal } = this.state
    this.setState({ showAddPaymentModal: !showAddPaymentModal })
  }

  calculateOutstandingBalance = async invoicePayment => {
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

  handleIsEditing = editing => {
    this.setState({ isEditing: editing })
  }

  shouldDisableSaveAndCompleteButton = () => {
    const { values } = this.props
    const { invoicePayer = [], invoice } = values
    if (invoice === null) return true
    if (invoicePayer.length === 0) return false

    return false
  }

  checkPackageSignature = () => {
    const { dispatch, values, clinicSettings } = this.props
    const { packageRedeemAcknowledge } = values
    const { isEnablePackage, isCheckPackageSignature } = clinicSettings
    const isExistingPackageSignature =
      packageRedeemAcknowledge &&
      packageRedeemAcknowledge.signature !== '' &&
      packageRedeemAcknowledge.signature !== undefined

    if (!isEnablePackage || !this.state.isConsumedPackage)
      return this.checkInvoiceOutstanding()

    if (
      isCheckPackageSignature.toLowerCase() ===
        PACKAGE_SIGNATURE_CHECK_OPTION.IGNORE.toLowerCase() ||
      isExistingPackageSignature
    )
      return this.checkInvoiceOutstanding()

    if (
      isCheckPackageSignature.toLowerCase() ===
      PACKAGE_SIGNATURE_CHECK_OPTION.OPTIONAL.toLowerCase()
    ) {
      return dispatch({
        type: 'global/updateState',
        payload: {
          openConfirm: true,
          openConfirmTitle: '',
          openConfirmText: 'Confirm',
          openConfirmContent:
            'Patient signature is not provided, confirm to complete billing?',
          onConfirmSave: () => {
            this.checkInvoiceOutstanding()
          },
        },
      })
    }
    if (
      isCheckPackageSignature.toLowerCase() ===
      PACKAGE_SIGNATURE_CHECK_OPTION.MANDATORY.toLowerCase()
    ) {
      notification.error({
        message: 'Patient signature is mandatory for package acknowledgement',
      })
      return false
    }
    return false
  }

  checkInvoiceOutstanding = async () => {
    const { dispatch, values, setFieldValue } = this.props
    await setFieldValue('mode', 'save')
    await setFieldValue('visitStatus', VISIT_STATUS.COMPLETED)

    const { invoice, invoicePayer = [] } = values
    const { outstandingBalance = 0 } = invoice

    // check if invoice is OVERPAID and prompt user for confirmation
    if (
      outstandingBalance < 0 ||
      invoicePayer.find(ip => ip.payerOutstanding < 0)
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

  onCompletePaymentClick = async () => {
    // check package acknowledge
    this.checkPackageSignature()
  }

  onPrintReceiptClick = invoicePaymentID => {
    const { dispatch } = this.props
    dispatch({
      type: 'report/updateState',
      payload: {
        reportTypeID: 29,
        reportParameters: { isSaved: true, invoicePaymentID },
      },
    })
  }

  onPrinterClick = (type, itemID, copayerID, invoicePayerid, index) => {
    switch (type) {
      case 'Payment':
        this.onShowReport(29, { InvoicePaymentId: itemID })
        break
      case 'TaxInvoice':
        this.onPrintInvoice(copayerID, invoicePayerid, index)
        break
      default:
        break
    }
  }

  onPrintInvoice = (copayerID, invoicePayerid, index) => {
    const { values, dispatch } = this.props
    const { invoicePayer } = values
    const modifiedOrNewAddedPayer = invoicePayer.filter(payer => {
      if (payer.id === undefined && payer.isCancelled) return false
      if (payer.id) return payer.isModified
      return true
    })
    let parametrPaload
    if (copayerID) {
      parametrPaload = {
        InvoiceId: values.invoice ? values.invoice.id : '',
        CopayerId: copayerID,
        InvoicePayerid: invoicePayerid,
        printIndex: index,
      }
    } else {
      parametrPaload = {
        InvoiceId: values.invoice ? values.invoice.id : '',
      }
    }
    if (modifiedOrNewAddedPayer.length > 0) {
      dispatch({
        type: 'global/updateState',
        payload: {
          openConfirm: true,
          openConfirmTitle: '',
          openConfirmText: 'Confirm',
          openConfirmContent: `Save changes and print invoice?`,
          onConfirmSave: () => {
            let currentPrintIndex
            if (parametrPaload.printIndex !== undefined) {
              const { printIndex, ...other } = parametrPaload
              parametrPaload = {
                ...other,
              }
              currentPrintIndex = invoicePayer.filter(
                (item, i) => !item.isCancelled && i < printIndex,
              ).length
            }

            const callback = () => {
              this.setState(preState => ({
                submitCount: preState.submitCount + 1,
              }))
              if (currentPrintIndex !== undefined) {
                const {
                  billing: { entity = {} },
                } = this.props
                parametrPaload = {
                  ...parametrPaload,
                  InvoicePayerid: entity.invoicePayer[currentPrintIndex].id,
                }
              }

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

  onPrintVisitInvoiceClick = () => {
    const { values } = this.props
    const parametrPaload = {
      InvoiceId: values.invoice ? values.invoice.id : '',
    }

    this.onShowReport(80, parametrPaload)
  }

  handleAddPayment = async payment => {
    const { values, setValues } = this.props
    const { outstandingBalance, ...rest } = payment
    const invoicePayment = [
      ...values.invoicePayment.filter(item => item.id),
      rest,
    ]
    const _newValues = {
      ...values,
      invoicePayment,
      mode: 'save',
      visitStatus: VISIT_STATUS.BILLING,
    }
    await setValues(_newValues)
    await this.calculateOutstandingBalance(invoicePayment)

    this.toggleAddPaymentModal()
    this.upsertBilling()
  }

  handleDeletePayment = async id => {
    const { values, setValues, user } = this.props
    const { invoicePayment } = values
    let _newInvoicePayment = [...invoicePayment]
    if (id === undefined) {
      _newInvoicePayment = invoicePayment.filter(
        payment => payment.id !== undefined,
      )
    } else {
      _newInvoicePayment = invoicePayment.map(payment =>
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
    const _newValues = {
      ...values,
      invoicePayment: _newInvoicePayment,
      mode: 'save',
      visitStatus: VISIT_STATUS.BILLING,
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
    }).then(response => {
      if (response) {
        this.setState(preState => ({
          submitCount: preState.submitCount + 1,
        }))
      }
    })
  }

  handleSaveBillingClick = () => {
    this.upsertBilling()
  }

  toggleSchemeValidationPrompt = () => {
    this.setState(preState => ({
      showSchemeValidationPrompt: !preState.showSchemeValidationPrompt,
    }))
  }

  handleDrugLabelClick = () => {
    const { dispense } = this.props
    const { prescription = [], packageItem = [] } = dispense.entity

    let drugList = []

    prescription.forEach(item => {
      drugList.push(item)
    })
    packageItem.forEach(item => {
      if (item.type === 'Medication') {
        drugList.push({
          ...item,
          name: item.description,
          dispensedQuanity: item.packageConsumeQuantity,
        })
      }
    })

    this.setState(prevState => {
      return {
        showDrugLabelSelection: !prevState.showDrugLabelSelection,
        selectedDrugs: drugList.map(x => {
          return { ...x, no: 1, selected: true }
        }),
      }
    })
  }

  handleDrugLabelSelectionClose = () => {
    this.setState(prevState => {
      return {
        showDrugLabelSelection: !prevState.showDrugLabelSelection,
      }
    })
  }

  handleDrugLabelSelected = (itemId, selected) => {
    this.setState(prevState => ({
      selectedDrugs: prevState.selectedDrugs.map(drug =>
        drug.id === itemId ? { ...drug, selected } : { ...drug },
      ),
    }))
    this.props.dispatch({ type: 'global/incrementCommitCount' })
  }

  handleDrugLabelNoChanged = (itemId, no) => {
    this.setState(prevState => ({
      selectedDrugs: prevState.selectedDrugs.map(drug =>
        drug.id === itemId ? { ...drug, no } : { ...drug },
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

  handleUpdatedAppliedInvoicePayerInfo = isUpdatedAppliedInvoicePayerInfo => {
    this.setState({ isUpdatedAppliedInvoicePayerInfo })
  }

  showRefreshOrder = () => {
    const { billing, values } = this.props
    const { shouldRefreshOrder } = billing
    let showRefreshOrder = shouldRefreshOrder
    const { visitStatus } = values
    if (
      visitStatus &&
      visitStatus !== VISIT_STATUS.BILLING &&
      visitStatus !== VISIT_STATUS.COMPLETED
    ) {
      showRefreshOrder = true
    }
    return showRefreshOrder
  }

  updateSignature = signature => {
    const { dispatch, values, patient } = this.props
    const { thumbnail } = signature

    dispatch({
      type: 'billing/savePackageAcknowledge',
      payload: {
        visitId: values.visitId,
        invoiceFK: values.invoice.id,
        signatureName: patient.name,
        signature: thumbnail,
      },
    })
  }

  render() {
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
      ctcopayer,
      ctservice,
      inventoryvaccination,
      inventorymedication,
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
      clinicSettings,
      inventoryvaccination,
      inventorymedication,
      ctservice,
      ctcopayer,
    }
    const {
      isEnableAddPaymentInBilling = false,
      isEnablePackage = false,
      isEnableVisitationInvoiceReport = false,
      autoPrintOnCompletePayment = false,
    } = clinicSettings
    let src
    if (
      values.packageRedeemAcknowledge &&
      values.packageRedeemAcknowledge.signature !== '' &&
      values.packageRedeemAcknowledge.signature !== undefined
    ) {
      src = `${base64Prefix}${values.packageRedeemAcknowledge.signature}`
    }

    return (
      <LoadingWrapper loading={loading} text='Getting billing info...'>
        <PatientBanner from='Billing' />
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
            <GridItem md={12}>
              {this.showRefreshOrder() && (
                <div style={{ paddingBottom: 8 }}>
                  <WarningSnackbar
                    variant='warning'
                    message='Changes detected. Please refresh order in dispensing screen. (Delete all the Co-payer payment if any)'
                  />
                </div>
              )}
            </GridItem>
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
                  handleUpdatedAppliedInvoicePayerInfo={
                    this.handleUpdatedAppliedInvoicePayerInfo
                  }
                  showRefreshOrder={this.showRefreshOrder()}
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
                isEnableVisitationInvoiceReport={
                  isEnableVisitationInvoiceReport
                }
                handlePrintVisitInvoiceClick={this.onPrintVisitInvoiceClick}
              />
            </GridContainer>
          </GridContainer>
        </Paper>
        <GridContainer>
          <GridItem
            md={isEnablePackage && this.state.isConsumedPackage ? 6 : 8}
          >
            <div
              style={{
                display: 'flex',
              }}
            >
              <FastField
                name='invoice.invoiceRemark'
                render={args => {
                  return (
                    <OutlinedTextField
                      label='Invoice Remarks'
                      multiline
                      maxLength={2000}
                      rowsMax={5}
                      rows={2}
                      disabled={
                        this.state.isUpdatedAppliedInvoicePayerInfo ||
                        this.showRefreshOrder()
                      }
                      {...args}
                    />
                  )
                }}
              />
              {autoPrintOnCompletePayment === true && (
                <div
                  style={{
                    marginLeft: 10,
                  }}
                >
                  <h5
                    style={{
                      width: 400,
                    }}
                  >
                    Auto print below documents after Complete Payment
                  </h5>
                  <Field
                    name='autoPrintReportsOnCompletePayment'
                    render={args => {
                      return (
                        <CheckboxGroup
                          disabled={
                            this.state.isEditing ||
                            values.id === undefined ||
                            this.state.isUpdatedAppliedInvoicePayerInfo ||
                            this.showRefreshOrder()
                          }
                          valueField='code'
                          textField='description'
                          options={ReportsOnCompletePayment}
                          noUnderline
                          {...args}
                        />
                      )
                    }}
                  />
                </div>
              )}
            </div>
          </GridItem>
          <GridItem
            md={isEnablePackage && this.state.isConsumedPackage ? 6 : 4}
            style={{ paddingRight: 0 }}
          >
            <React.Fragment>
              <div className={classes.paymentButton}>
                {isEnablePackage && this.state.isConsumedPackage && (
                  <Button
                    color={
                      src !== '' && src !== undefined ? 'success' : 'danger'
                    }
                    onClick={() => {
                      this.setState({
                        isShowAcknowledge: true,
                      })
                    }}
                    disabled={this.state.isEditing || values.id === undefined}
                  >
                    Acknowledge
                  </Button>
                )}
                <Button
                  color='info'
                  onClick={this.backToDispense}
                  disabled={
                    this.state.isEditing ||
                    values.id === undefined ||
                    values.invoicePayer.find(payer =>
                      (payer.invoicePayment || []).find(
                        payment => !payment.isCancelled,
                      ),
                    )
                  }
                >
                  <ArrowBack />
                  Dispense
                </Button>
                <Button
                  color='primary'
                  onClick={this.handleSaveBillingClick}
                  disabled={
                    this.state.isEditing ||
                    values.id === undefined ||
                    this.state.isUpdatedAppliedInvoicePayerInfo ||
                    this.showRefreshOrder()
                  }
                >
                  Save Billing
                </Button>
                <Button
                  color='success'
                  disabled={
                    this.state.isEditing ||
                    values.id === undefined ||
                    this.state.isUpdatedAppliedInvoicePayerInfo ||
                    this.showRefreshOrder()
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
          title={
            reportPayload.reportID === 15 ? 'Invoice' : 'Visitation Invoice'
          }
          maxWidth='lg'
        >
          <ReportViewer
            showTopDivider={false}
            reportID={reportPayload.reportID}
            reportParameters={reportPayload.reportParameters}
          />
        </CommonModal>
        <CommonModal
          open={this.state.isShowAcknowledge}
          title='Package Acknowledge'
          observe='PackageAcknowledge'
          onClose={() => {
            this.setState({
              isShowAcknowledge: false,
            })
          }}
        >
          <Signature
            signatureName={patient.name}
            updateSignature={this.updateSignature}
            image={src}
            isEditable={src === '' || src === undefined}
            signatureNameLabel='Patient Name'
          />
        </CommonModal>
        <ViewPatientHistory top='239px' />
      </LoadingWrapper>
    )
  }
}

export default withStyles(styles, { name: 'BillingScreen' })(Billing)
