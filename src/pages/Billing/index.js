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
  Checkbox,
  CheckboxGroup,
} from '@/components'
import { AddPayment, LoadingWrapper, ReportViewer } from '@/components/_medisys'
// common utils
import { roundTo, getUniqueId } from '@/utils/utils'
import { INVOICE_PAYER_TYPE, INVOICE_REPORT_TYPES } from '@/utils/constants'
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
import InvoicePaymentDetails from './components/InvoicePaymentDetails'
// page utils
import {
  constructPayload,
  validateApplySchemesWithPatientSchemes,
} from './utils'
import { subscribeNotification } from '@/utils/realtime'
import { CollectionsOutlined } from '@material-ui/icons'

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
    paddingBottom: theme.spacing(1),
  },
  rightIcon: {
    position: 'relative',
    fontWeight: 600,
    color: 'white',
    fontSize: '0.7rem',
    padding: '2px 3px',
    height: 20,
    cursor: 'pointer',
    margin: '0px 1px',
    lineHeight: '16px',
  },
})

const base64Prefix = 'data:image/jpeg;base64,'

const getDispenseEntity = (codetable, clinicSettings, entity = {}) => {
  const { inventoryconsumable = [] } = codetable

  const {
    primaryPrintoutLanguage = 'EN',
    secondaryPrintoutLanguage = '',
  } = clinicSettings

  let orderItems = []
  const defaultItem = (item, groupName) => {
    return {
      ...item,
      stockBalance: item.quantity,
      dispenseGroupId: groupName,
      countNumber: 1,
      rowspan: 1,
      uid: getUniqueId(),
    }
  }

  const transactionDetails = item => {
    const {
      inventoryStockFK,
      batchNo,
      expiryDate,
      oldQty,
      transactionQty,
      uomDisplayValue,
      secondUOMDisplayValue,
    } = item
    return {
      dispenseQuantity: transactionQty,
      batchNo,
      expiryDate,
      stock: oldQty,
      stockFK: inventoryStockFK,
      uomDisplayValue,
      secondUOMDisplayValue,
    }
  }

  const generateFromTransaction = item => {
    const groupName = 'NormalDispense'

    if (item.dispenseItem.length) {
      item.dispenseItem.forEach((di, index) => {
        orderItems.push({
          ...defaultItem(item, groupName),
          ...transactionDetails(di),
          stockBalance:
            item.quantity - _.sumBy(item.dispenseItem, 'transactionQty'),
          countNumber: index === 0 ? 1 : 0,
          rowspan: index === 0 ? item.dispenseItem.length : 0,
          uid: getUniqueId(),
        })
      })
    } else {
      orderItems.push(defaultItem(item, groupName))
    }
    const groupItems = orderItems.filter(
      oi => oi.type === item.type && oi.id === item.id,
    )
    groupItems[0].groupNumber = 1
    groupItems[0].groupRowSpan = groupItems.length
  }

  const sortOrderItems = [...(entity.consumable || [])]

  sortOrderItems.forEach(item => {
    generateFromTransaction(item)
  })
  const defaultExpandedGroups = _.uniqBy(orderItems, 'dispenseGroupId').map(
    o => o.dispenseGroupId,
  )
  return {
    ...entity,
    dispenseItems: orderItems,
    defaultExpandedGroups,
  }
}

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
    ctservice: codetable.ctservice || [],
    commitCount: global.commitCount,
    clinicSettings: clinicSettings.settings,
    codetable,
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
          (totalClaim, payer) => totalClaim + payer.payerDistributedAmt,
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
          consReady: billing.entity.consReady,
          autoPrintReportsOnCompletePayment: autoPrintReportsOnCompletePayment.split(
            ',',
          ),
          patientID: billing.patientID,
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
    selectedDrugs: [],
    isUpdatedAppliedInvoicePayerInfo: false,
    hasNewSignature: false,
  }

  componentDidMount() {
    subscribeNotification('QueueListing', {
      callback: response => {
        const { visitID, senderId, isBillingSaved } = response
        const {
          dispatch,
          values: { id },
          location: { pathname },
        } = this.props
        if (
          visitID != id &&
          isBillingSaved !== undefined &&
          pathname == '/reception/queue/billing'
        ) {
        }
      },
    })
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
    const { history, dispatch, billing } = this.props
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
      const { invoice, invoicePayment } = values
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
                  printType: INVOICE_REPORT_TYPES.PAYMENT_RECEIPT,
                })}`,
              })),
            )
          }
        }
      }

      if (printData && printData.length > 0) {
        const token = localStorage.getItem('token')
        printData = printData.map(item => ({
          ...item,
          Token: token,
          BaseUrl: process.env.url,
        }))
      }

      if (printData.length > 0) {
        await this.childOnPrintRef({
          type: 1,
          printData,
        })
      }
    }
  }

  upsertBilling = async (
    callback = null,
    noValidation = false,
    backtoQueue = false,
  ) => {
    const { dispatch, values, resetForm, patient } = this.props
    await this.calculateOutstandingBalance(null)
    const {
      visitStatus,
      invoicePayer = [],
      autoPrintReportsOnCompletePayment = [],
      consReady,
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
              message: backtoQueue ? 'Billing Completed' : 'Billing Saved',
            })
            if (!backtoQueue) {
              this.setState(preState => ({
                submitCount: preState.submitCount + 1,
              }))
            }
            await this.printAfterComplete(autoPrintReportsOnCompletePayment)
            if (backtoQueue) {
              history.push('/reception/queue')
            }
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
              hasNewSignature: false,
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
  getInvoiceReportTitle = reportPayload => {
    switch (reportPayload?.reportParameters?.printType) {
      case INVOICE_REPORT_TYPES.CLAIMABLEITEMCATEGORYINVOICE:
        return 'Claimable Item Category Invoice'
      case INVOICE_REPORT_TYPES.CLAIMABLEITEMINVOICE:
        return 'Claimable Item Invoice'
      case INVOICE_REPORT_TYPES.INDIVIDUALINVOICE:
        return 'Invoice'
      case INVOICE_REPORT_TYPES.ITEMCATEGORYINVOICE:
        return 'Item Category Invoice'
      case INVOICE_REPORT_TYPES.SUMMARYINVOICE:
        return 'Summary Invoice'
      case INVOICE_REPORT_TYPES.PAYMENT_RECEIPT:
        return 'Payment Receipt'
    }
    return 'Invoice'
  }
  backToDispense = () => {
    const { dispatch, billing } = this.props
    dispatch({
      type: 'billing/backToDispense',
    })
  }

  toggleAddPaymentModal = () => {
    this.setState(preState => ({
      disabledPayment: undefined,
      showAddPaymentModal: !preState.showAddPaymentModal,
    }))
  }

  onAddPaymentClick = async => {
    const callBack = () => {
      this.setState(preState => ({
        submitCount: preState.submitCount + 1,
        disabledPayment: undefined,
        showAddPaymentModal: !preState.showAddPaymentModal,
      }))
    }

    this.upsertBilling(callBack)
  }

  calculateOutstandingBalance = async invoicePayment => {
    const { values, setFieldValue } = this.props

    const totalPaid = (invoicePayment || values.invoicePayment).reduce(
      (totalAmtPaid, payment) => {
        // || !payment.id is in order to include current payment
        if ((!payment.isCancelled && payment.id) || !payment.id)
          return totalAmtPaid + payment.totalAmtPaid
        return totalAmtPaid
      },
      0,
    )
    const newOutstandingBalance = roundTo(values.finalPayable - totalPaid)
    console.log(newOutstandingBalance)
    await setFieldValue('invoice', {
      ...values.invoice,
      outstandingBalance: newOutstandingBalance,
    })
  }

  onExpandDispenseDetails = async (event, p, expanded) => {
    const { dispense } = this.props
    if (expanded && p.key === 0 && !dispense.entity) {
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

  checkInvoiceOutstanding = async () => {
    const { dispatch, values, setFieldValue } = this.props
    await setFieldValue('mode', 'save')
    await setFieldValue('visitStatus', VISIT_STATUS.COMPLETED)

    const { invoice, invoicePayer = [] } = values
    const { outstandingBalance = 0, invoiceItems = [] } = invoice

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
          onConfirmSave: () => {
            this.upsertBilling(null, null, true)
          },
        },
      })
    }

    if (
      invoiceItems.find(item => {
        let totalClaim = 0
        invoicePayer.forEach(payer => {
          const selectInfo = (payer.invoicePayerItem || []).find(
            x => x.invoiceItemFK === item.id,
          )
          if (selectInfo) {
            totalClaim = totalClaim + selectInfo.claimAmount
          }
        })
        if (roundTo(item.totalAfterGst - totalClaim - item.paidAmount) < 0) {
          return true
        }
        return false
      })
    ) {
      return dispatch({
        type: 'global/updateState',
        payload: {
          openConfirm: true,
          openConfirmTitle: '',
          openConfirmText: 'Confirm',
          openConfirmContent:
            'Invoice Item is overpaid. Confirm to complete billing?',
          onConfirmSave: () => {
            this.upsertBilling(null, null, true)
          },
        },
      })
    }
    return this.upsertBilling(null, null, true)
  }

  onCompletePaymentClick = async () => {
    this.checkInvoiceOutstanding()
  }

  onPrintReceiptClick = invoicePaymentID => {
    const { dispatch } = this.props
    dispatch({
      type: 'report/updateState',
      payload: {
        reportTypeID: 29,
        reportParameters: {
          isSaved: true,
          invoicePaymentID,
          printType: INVOICE_REPORT_TYPES.PAYMENT_RECEIPT,
        },
      },
    })
  }

  onPrinterClick = (
    type,
    itemID,
    copayerID,
    invoicePayerid,
    index,
    invoiceReportType,
  ) => {
    switch (type) {
      case 'Payment':
        this.onShowReport(29, {
          InvoicePaymentId: itemID,
          printType: INVOICE_REPORT_TYPES.PAYMENT_RECEIPT,
        })
        break
      case 'TaxInvoice':
        this.onPrintInvoice(copayerID, invoicePayerid, index, invoiceReportType)
        break
      default:
        break
    }
  }

  onPrintInvoice = (
    copayerID,
    invoicePayerid,
    index,
    invoiceReportType,
    forceSave = false,
  ) => {
    const { values, dispatch } = this.props
    const { invoicePayer } = values
    const reportID = 15
    let parametrPayload
    if (copayerID) {
      parametrPayload = {
        InvoiceId: values.invoice ? values.invoice.id : '',
        CopayerId: copayerID,
        InvoicePayerid: invoicePayerid,
        printIndex: index,
        printType: invoiceReportType,
        _key: values?.invoice?.invoiceNo || '',
      }
    } else {
      parametrPayload = {
        InvoiceId: values.invoice ? values.invoice.id : '',
        printType: invoiceReportType,
        _key: values?.invoice?.invoiceNo || '',
      }
    }
    const saveAndPrint = () => {
      let currentPrintIndex
      if (parametrPayload.printIndex !== undefined) {
        const { printIndex, ...other } = parametrPayload
        parametrPayload = {
          ...other,
        }
        currentPrintIndex = invoicePayer.filter(
          (item, i) => !item.isCancelled && i < printIndex,
        ).length
      }

      const callback = () => {
        this.setState(preState => ({
          submitCount: preState.submitCount + 1,
          hasNewSignature: false,
        }))
        if (currentPrintIndex !== undefined) {
          const {
            billing: { entity = {} },
          } = this.props
          parametrPayload = {
            ...parametrPayload,
            InvoicePayerid: entity.invoicePayer[currentPrintIndex].id,
            printType: invoiceReportType,
          }
        }

        this.onShowReport(reportID, {
          ...parametrPayload,
        })
      }
      this.upsertBilling(callback)
    }
    if (forceSave) {
      saveAndPrint()
    } else {
      const modifiedOrNewAddedPayer = invoicePayer.filter(payer => {
        if (payer.id === undefined && payer.isCancelled) return false
        if (payer.id) return payer.isModified
        return true
      })
      if (modifiedOrNewAddedPayer.length > 0 || this.state.hasNewSignature) {
        dispatch({
          type: 'global/updateState',
          payload: {
            openConfirm: true,
            openConfirmTitle: '',
            openConfirmText: 'Confirm',
            openConfirmContent: `Save changes and print invoice?`,
            onConfirmSave: () => {
              saveAndPrint()
            },
          },
        })
      } else if (!values.invoice.isBillingSaved) {
        saveAndPrint()
      } else {
        this.onShowReport(reportID, { ...parametrPayload })
      }
    }
  }

  onPrintInvoiceClick = invoiceReportType => {
    const {
      dispatch,
      values: {},
    } = this.props
    this.onPrintInvoice(undefined, undefined, undefined, invoiceReportType)
  }

  onPrintVisitInvoiceClick = () => {
    const { values } = this.props
    const parametrPayload = {
      InvoiceId: values.invoice ? values.invoice.id : '',
    }

    this.onShowReport(80, parametrPayload)
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

  onShowReport = (reportID, reportParameters, printType) => {
    this.setState({
      showReport: true,
      reportPayload: {
        reportID,
        reportParameters,
        printType,
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
      visitStatus !== VISIT_STATUS.COMPLETED &&
      visitStatus !== VISIT_STATUS.IN_CONS &&
      visitStatus !== VISIT_STATUS.UNGRADED &&
      visitStatus !== VISIT_STATUS.VERIFIED
    ) {
      showRefreshOrder = true
    }
    return showRefreshOrder
  }

  updateInvoiceSignature = signature => {
    const { dispatch, values, patient, setFieldValue } = this.props
    const { thumbnail } = signature
    if (thumbnail != values.invoice.signature) {
      this.setState({ hasNewSignature: true })
    }
    setFieldValue('invoice', {
      ...values.invoice,
      signatureName: thumbnail ? patient.name : undefined,
      signature: thumbnail ? thumbnail : undefined,
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
      disabledPayment,
    } = this.state
    const {
      classes,
      dispatch,
      values,
      dispense,
      loading,
      dispenseLoading,
      setFieldValue,
      setValues: setValuesHook,
      patient,
      sessionInfo,
      user,
      commitCount,
      ctschemetype,
      ctcopaymentscheme,
      ctcopayer,
      ctservice,
      clinicSettings,
      codetable,
    } = this.props
    const setValues = v => {
      let newValues = v
      setValuesHook(newValues)
    }

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
      ctservice,
      ctcopayer,
    }
    const {
      isEnableAddPaymentInBilling = false,
      isEnableVisitationInvoiceReport = false,
      autoPrintOnCompletePayment = false,
    } = clinicSettings
    let invoiceSignatureSrc
    if (
      values?.invoice?.signature &&
      values?.invoice?.signature !== '' &&
      values?.invoice?.signature !== undefined
    ) {
      invoiceSignatureSrc = `${base64Prefix}${values?.invoice?.signature}`
    }

    return (
      <LoadingWrapper loading={loading} text='Getting billing info...'>
        <PatientBanner from='Billing' />
        <div className={classes.accordionContainer}>
          <LoadingWrapper linear loading={dispenseLoading}>
            <Accordion
              onChange={this.onExpandDispenseDetails}
              collapses={[
                {
                  key: 0,
                  title: 'Dispensing Details',
                  content: (
                    <div className={classes.dispenseContainer}>
                      <DispenseDetails
                        viewOnly
                        values={
                          dispense.entity
                            ? getDispenseEntity(
                                codetable,
                                clinicSettings,
                                dispense.entity,
                              )
                            : dispense.entity
                        }
                        history={this.props.history}
                        dispatch={this.props.dispatch}
                      />
                    </div>
                  ),
                },
                {
                  key: 1,
                  title: 'Invoice Payment Details',
                  content: (
                    <div className={classes.dispenseContainer}>
                      <InvoicePaymentDetails
                        invoice={values.invoice}
                        {...this.props}
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
                handleAddPaymentClick={this.onAddPaymentClick}
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
          <GridItem md={8}>
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
          <GridItem md={4} style={{ paddingRight: 0 }}>
            <React.Fragment>
              <div className={classes.paymentButton}>
                <Button
                  size='sm'
                  color={
                    invoiceSignatureSrc !== '' &&
                    invoiceSignatureSrc !== undefined
                      ? 'success'
                      : 'danger'
                  }
                  onClick={() => {
                    this.setState({
                      isShowInvoiceSignature: true,
                    })
                  }}
                  disabled={this.state.isEditing || values.id === undefined}
                >
                  Patient Signature
                </Button>
                <Button
                  color='info'
                  size='sm'
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
                  size='sm'
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
                  size='sm'
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
                <div style={{ textAlign: 'left', paddingLeft: 10 }}>
                  <Field
                    name='consReady'
                    render={args => {
                      return (
                        <Checkbox
                          label='Update visit consultation ready to Yes'
                          {...args}
                        />
                      )
                    }}
                  />
                </div>
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
          title={`Add Payment`}
          onClose={this.toggleAddPaymentModal}
          observe='AddPaymentForm'
          maxWidth='lg'
        >
          {showAddPaymentModal && (
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
              patientPayer={values.patientPayer}
              disabledPayment={disabledPayment}
            />
          )}
        </CommonModal>
        <CommonModal
          open={showReport}
          onClose={this.onCloseReport}
          title={this.getInvoiceReportTitle(reportPayload)}
          maxWidth='lg'
        >
          <ReportViewer
            showTopDivider={false}
            reportID={reportPayload.reportID}
            reportParameters={reportPayload.reportParameters}
          />
        </CommonModal>
        <CommonModal
          open={this.state.isShowInvoiceSignature}
          title='Patient Signature'
          onClose={() => {
            this.setState({
              isShowInvoiceSignature: false,
            })
          }}
        >
          <Signature
            signatureName={patient.name}
            updateSignature={this.updateInvoiceSignature}
            image={invoiceSignatureSrc}
            signatureNameLabel='Patient Name'
            allowClear={true}
          />
        </CommonModal>
        <ViewPatientHistory top='239px' />
      </LoadingWrapper>
    )
  }
}

export default withStyles(styles, { name: 'BillingScreen' })(Billing)
