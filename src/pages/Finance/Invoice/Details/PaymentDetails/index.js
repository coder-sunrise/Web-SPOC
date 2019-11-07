import React, { Component } from 'react'
import { connect } from 'dva'
import _ from 'lodash'
import { AddPayment } from 'medisys-components'
import moment from 'moment'
// material ui
import { withStyles } from '@material-ui/core'
import Printer from '@material-ui/icons/Print'
// common components
import {
  CommonModal,
  withFormik,
  WarningSnackbar,
  notification,
  Button,
} from '@/components'
// sub components
import AddCrNote from '../../components/modal/AddCrNote'
import WriteOff from '../../components/modal/WriteOff'
import PaymentCard from './PaymentCard'
import DeleteConfirmation from '../../components/modal/DeleteConfirmation'
import { ReportViewer } from '@/components/_medisys'
// styles
import styles from './styles'
import { getBizSession } from '@/services/queue'

const defaultPatientPayment = {
  id: undefined,
  invoiceFK: undefined,
  invoicePayerWriteOff: [],
  invoicePayment: [],
  isCancelled: false,
  isDeleted: false,
  outStanding: 0,
  patientName: '',
  patientProfileFK: undefined,
  payerDistributedAmt: 0,
  payerType: 'Patient',
  payerTypeFK: 1,
  paymentTxnList: [],
  sequence: 0,
  statementInvoice: [],
  totalPaid: 0,
}

@connect(({ invoiceDetail, invoicePayment }) => ({
  invoiceDetail,
  invoicePayment,
}))
@withFormik({
  name: 'invoicePayment',
  enableReinitialize: true,
  mapPropsToValues: ({ invoicePayment, invoiceDetail }) => {
    // console.log({ invoicePayment, invoiceDetail })
    // const { entity: invoiceDetailEntity } = invoiceDetail
    // const { entity = [] } = invoicePayment

    // const isEmpty = entity.length === 0
    // let _values = {}
    // if (isEmpty) {
    //   _values = [
    //     {
    //       ...defaultPatientPayment,
    //       invoiceFK: invoiceDetailEntity.id,
    //       patientName: invoiceDetailEntity.patientName,
    //       outStanding: invoiceDetailEntity.outstandingBalance,
    //     },
    //   ]
    //   console.log({ _values })
    //   return _values
    // }
    return invoicePayment.entity || {}
  },
})
class PaymentDetails extends Component {
  state = {
    showAddPayment: false,
    showAddCrNote: false,
    showWriteOff: false,
    showDeleteConfirmation: false,
    onVoid: {},
    selectedInvoicePayerFK: undefined,
    showReport: false,
    reportPayload: {
      reportID: undefined,
      reportParameters: undefined,
    },
    hasActiveSession: false,
    invoicePayerName: undefined,
    invoicePayerPayment: {},
  }

  componentDidMount = () => {
    this.checkHasActiveSession()
  }

  _validateOutstandingAmount = (invoicePayer, callback) => {
    if (invoicePayer.outStanding === 0) {
      notification.error({
        message: 'This payer does not have any outstanding',
      })
    } else callback()
  }

  checkHasActiveSession = async () => {
    const bizSessionPayload = {
      IsClinicSessionClosed: false,
    }
    const result = await getBizSession(bizSessionPayload)
    const { data } = result.data

    this.setState(() => {
      return {
        hasActiveSession: data.length > 0,
      }
    })
  }

  refresh = () => {
    const { dispatch, invoiceDetail } = this.props
    dispatch({
      type: 'invoiceDetail/query',
      payload: {
        id: invoiceDetail.currentId,
      },
    })
    dispatch({
      type: 'invoicePayment/query',
      payload: {
        id: invoiceDetail.currentId,
      },
    })
  }

  onAddPaymentClick = (invoicePayerFK) => {
    const { dispatch, values, invoiceDetail } = this.props
    const invoicePayer = values.find(
      (item) => parseInt(item.id, 10) === parseInt(invoicePayerFK, 10),
    )
    const queryPatientProfileThenShowAddPayment = () => {
      dispatch({
        type: 'patient/query',
        payload: { id: values.patientProfileFK },
        // payload: { id: 4 },
      }).then((r) => {
        const invoicePayerPayment = {
          ...invoiceDetail.entity,
          totalAftGst: invoicePayer.payerDistributedAmt,
          outstandingBalance: invoicePayer.outStanding,
          finalPayable: invoicePayer.outStanding,
          totalClaims: undefined,
        }
        let invoicePayerName = ''
        if (invoicePayer.payerTypeFK === 1)
          invoicePayerName = invoicePayer.patientName
        if (invoicePayer.payerTypeFK === 2)
          invoicePayerName = invoicePayer.payerType
        if (invoicePayer.payerTypeFK === 4)
          invoicePayerName = invoicePayer.companyName
        if (r)
          this.setState({
            showAddPayment: true,
            selectedInvoicePayerFK: invoicePayerFK,
            invoicePayerName,
            invoicePayerPayment,
          })
      })
    }
    this._validateOutstandingAmount(
      invoicePayer,
      queryPatientProfileThenShowAddPayment,
    )
  }

  onWriteOffClick = (invoicePayerFK) => {
    const { values } = this.props
    const invoicePayer = values.find((item) => item.id === invoicePayerFK)
    const showWriteOffModal = () => {
      this.setState({
        showWriteOff: true,
        selectedInvoicePayerFK: invoicePayerFK,
      })
    }
    this._validateOutstandingAmount(invoicePayer, showWriteOffModal)
    // if (invoicePayer.outStanding === 0) {
    //   notification.error({
    //     message: 'This payer does not have any outstanding',
    //   })
    // } else {

    // }
  }

  closeAddCrNoteModal = () =>
    this.setState({ showAddCrNote: false, selectedInvoicePayerFK: undefined })

  closeWriteOffModal = () => {
    this.setState({ showWriteOff: false, selectedInvoicePayerFK: undefined })
  }

  closeDeleteConfirmationModal = () =>
    this.setState({ showDeleteConfirmation: false, onVoid: {} })

  closeAddPaymentModal = () =>
    this.setState({
      showAddPayment: false,
      selectedInvoicePayerFK: undefined,
      invoicePayerName: '',
      invoicePayerPayment: undefined,
    })

  onVoidClick = (entity) => {
    this.setState({
      showDeleteConfirmation: true,
      onVoid: { ...entity },
    })
  }

  onAddCrNoteClick = (invoicePayerFK) => {
    const { dispatch, invoiceDetail, invoicePayment } = this.props
    dispatch({
      type: 'invoiceCreditNote/mapCreditNote',
      payload: {
        invoicePayerFK,
        invoiceDetail: invoiceDetail.entity || {},
        invoicePaymentDetails: invoicePayment.entity || {},
      },
    })

    this.setState({ showAddCrNote: true })
  }

  onPrinterClick = (type, itemID) => {
    const { invoicePayment } = this.props
    switch (type) {
      case 'Payment':
        this.onShowReport('InvoicePaymentId', 29, itemID)
        break
      case 'Credit Note':
        this.onShowReport('CreditNoteId', 18, itemID)
        break
      case 'TaxInvoice':
        this.onShowReport(
          'InvoiceId',
          15,
          invoicePayment ? invoicePayment.currentId : '',
        )
        break
      default:
        break
    }
  }

  onShowReport = (paramKey, reportID, itemID) => {
    this.setState({
      showReport: true,
      reportPayload: {
        reportID,
        reportParameters: { [paramKey]: itemID },
      },
    })
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

  // submitAddPayment
  onSubmitAddPayment = (invoicePaymentList) => {
    const { selectedInvoicePayerFK } = this.state
    this.props
      .dispatch({
        type: 'invoicePayment/submitAddPayment',
        payload: {
          invoicePayerFK: selectedInvoicePayerFK,
          invoicePaymentList,
        },
      })
      .then((r) => {
        if (r) {
          this.refresh()
          this.closeAddPaymentModal()
        }
      })
  }

  onSubmitWriteOff = (writeOffData) => {
    const { selectedInvoicePayerFK } = this.state
    this.props
      .dispatch({
        type: 'invoicePayment/submitWriteOff',
        payload: {
          invoicePayerFK: selectedInvoicePayerFK,
          writeOffReason: writeOffData,
        },
      })
      .then((r) => {
        if (r) {
          this.refresh()
          this.closeWriteOffModal()
        }
      })
  }

  onSubmitVoid = (cancelReason) => {
    const { onVoid } = this.state
    const { type } = onVoid
    let dispatchType
    switch (type) {
      case 'Payment':
        dispatchType = 'invoicePayment/submitVoidPayment'
        break
      case 'Write Off':
        dispatchType = 'invoicePayment/submitVoidWriteOff'
        break
      case 'Credit Note':
        dispatchType = 'invoicePayment/submitVoidCreditNote'
        break
      default:
        break
    }

    if (dispatchType) {
      this.props
        .dispatch({
          type: dispatchType,
          payload: {
            ...onVoid,
            cancelReason,
          },
        })
        .then((r) => {
          if (r) {
            this.refresh()
            this.closeDeleteConfirmationModal()
          }
        })
    }
  }

  render () {
    // console.log('PaymentIndex', this.props)
    const { classes, values, readOnly, invoiceDetail } = this.props
    const { hasActiveSession } = this.state
    const paymentActionsProps = {
      handleAddPayment: this.onAddPaymentClick,
      handleAddCrNote: this.onAddCrNoteClick,
      handleWriteOff: this.onWriteOffClick,
      handleVoidClick: this.onVoidClick,
      handlePrinterClick: this.onPrinterClick,
    }
    const {
      showAddPayment,
      showAddCrNote,
      showWriteOff,
      showDeleteConfirmation,
      onVoid,
      showReport,
      reportPayload,
      invoicePayerName,
      invoicePayerPayment,
    } = this.state

    return (
      <div className={classes.container}>
        {readOnly ? (
          <div style={{ paddingTop: 5 }}>
            <WarningSnackbar
              variant='warning'
              className={classes.margin}
              message='All action is not allowed due to no active session was found.'
            />
          </div>
        ) : (
          ''
        )}
        {!_.isEmpty(values) ? (
          values
            .sort((a, b) => a.payerTypeFK - b.payerTypeFK)
            .map((payment) => {
              return (
                <PaymentCard
                  companyName={payment.companyName}
                  patientName={payment.patientName}
                  payerType={payment.payerType}
                  payerTypeFK={payment.payerTypeFK}
                  payments={payment.paymentTxnList}
                  totalPaid={payment.totalPaid}
                  outstanding={payment.outStanding}
                  invoicePayerFK={payment.id}
                  actions={paymentActionsProps}
                  readOnly={readOnly}
                  hasActiveSession={hasActiveSession}
                />
              )
            })
        ) : (
          ''
        )}
        {/* <PaymentCard
          payerType={PayerType.PATIENT}
          payerName={invoiceDetail.patientName || 'N/A'}
          // payments={paymentTxnList.patientPaymentTxn}
          payments={[]}
          actions={paymentActionsProps}
          totalPaid={values.totalPaid}
          outstanding={values.outStanding}
        />
        <PaymentCard
          actions={paymentActionsProps}
          payerType={PayerType.GOVT_COPAYER}
          payerName='CHAS'
          // payments={paymentTxnList.coPayerPaymentTxn}
          payments={[]}
        /> */}
        {/* <PaymentCard
          actions={paymentActionsProps}
          payerType={PayerType.COPAYER}
          payerName='Medisys'
          payments={paymentTxnList.govCoPayerPaymentTxn}
        /> */}
        <CommonModal
          open={showAddPayment}
          title='Add Payment'
          onConfirm={this.closeAddPaymentModal}
          onClose={this.closeAddPaymentModal}
          observe='AddPaymentForm'
        >
          {/* <AddPayment handleSubmit={this.onSubmit} /> */}
          <AddPayment
            handleSubmit={this.onSubmitAddPayment}
            onClose={this.closeAddPaymentModal}
            invoicePayerName={invoicePayerName}
            invoicePayment={[]}
            // invoice={{
            //   ...invoiceDetail.entity,
            //   totalAftGst: invoiceDetail.entity.invoiceTotalAftGST,
            //   finalPayable: invoiceDetail.entity.outstandingBalance,
            // }}
            invoice={invoicePayerPayment}
          />
        </CommonModal>
        <CommonModal
          open={showAddCrNote}
          title='Add Credit Note'
          closeIconTooltip='Close Credit Note'
          onConfirm={this.closeAddCrNoteModal}
          onClose={this.closeAddCrNoteModal}
          maxWidth='lg'
        >
          <AddCrNote onRefresh={this.refresh} />
        </CommonModal>

        <CommonModal
          open={showWriteOff}
          title='Write Off'
          onConfirm={this.closeWriteOffModal}
          onClose={this.closeWriteOffModal}
          maxWidth='sm'
        >
          <WriteOff handleSubmit={this.onSubmitWriteOff} />
        </CommonModal>

        <CommonModal
          open={showDeleteConfirmation}
          title={`Void ${onVoid.type}`}
          onConfirm={this.closeDeleteConfirmationModal}
          onClose={this.closeDeleteConfirmationModal}
          maxWidth='sm'
        >
          <DeleteConfirmation handleSubmit={this.onSubmitVoid} {...onVoid} />
        </CommonModal>
        <CommonModal
          open={showReport}
          onClose={this.onCloseReport}
          title='Invoice'
          maxWidth='lg'
        >
          <ReportViewer
            reportID={reportPayload.reportID}
            reportParameters={reportPayload.reportParameters}
          />
        </CommonModal>
      </div>
    )
  }
}

export default withStyles(styles)(PaymentDetails)
