import React, { Component } from 'react'
import { connect } from 'dva'
import _ from 'lodash'
import { AddPayment } from 'medisys-components'
import moment from 'moment'
// material ui
import { withStyles } from '@material-ui/core'
// common components
import { CommonModal, withFormik, dateFormatLong } from '@/components'
// sub components
import AddCrNote from '../../components/modal/AddCrNote'
import WriteOff from '../../components/modal/WriteOff'
import PaymentCard from './PaymentCard'
import DeleteConfirmation from '../../components/modal/DeleteConfirmation'
// styles
import styles from './styles'
import { PayerType } from './variables'

@connect(({ invoiceDetail, invoicePayment }) => ({
  invoiceDetail,
  invoicePayment,
}))
@withFormik({
  name: 'invoicePayment',
  enableReinitialize: true,
  mapPropsToValues: ({ invoicePayment }) => {
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

  onAddPaymentClick = (invoicePayerFK) =>
    this.setState({
      showAddPayment: true,
      selectedInvoicePayerFK: invoicePayerFK,
    })

  onWriteOffClick = (invoicePayerFK) =>
    this.setState({
      showWriteOff: true,
      selectedInvoicePayerFK: invoicePayerFK,
    })

  closeAddPaymentModal = () =>
    this.setState({ showAddPayment: false, selectedInvoicePayerFK: undefined })

  closeAddCrNoteModal = () => this.setState({ showAddCrNote: false })

  closeWriteOffModal = () => {
    this.setState({ showWriteOff: false, selectedInvoicePayerFK: undefined })
  }

  closeDeleteConfirmationModal = () =>
    this.setState({ showDeleteConfirmation: false, onVoid: {} })

  onVoidClick = (entity) => {
    this.setState({
      showDeleteConfirmation: true,
      onVoid: { ...entity },
    })
  }

  onAddCrNoteClick = (payerType) => {
    const { dispatch, invoiceDetail, invoicePayment } = this.props
    dispatch({
      type: 'invoiceCreditNote/mapCreditNote',
      payload: {
        invoicePayerFK: payerType,
        invoiceDetail,
        creditNote: invoicePayment.entity.creditNote || [],
      },
    })

    this.setState({ showAddCrNote: true })
  }

  onPrinterClick = ({ currentTarget }) => {
    console.log({ printer: currentTarget })
  }

  // submitAddPayment
  onSubmit = (paymentData) => {
    const { selectedInvoicePayerFK } = this.state
    this.props
      .dispatch({
        type: 'invoicePayment/submitAddPayment',
        payload: {
          invoicePayerFK: selectedInvoicePayerFK,
          paymentData: _.toArray(paymentData),
        },
      })
      .then((r) => {
        if (r) this.refresh()
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
            this.closeDeleteConfirmationModal()
            this.refresh()
          }
        })
    }
  }

  render () {
    const { classes, invoiceDetail, values } = this.props
    // const { paymentTxnList } = values
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
    } = this.state

    return (
      <div className={classes.container}>
        {!_.isEmpty(values) ? (
          values
            .sort((a, b) => a.payerTypeFK - b.payerTypeFK)
            .map((payment) => {
              return (
                <PaymentCard
                  patientName={payment.patientName}
                  payerType={payment.payerTypeFK}
                  payments={payment.paymentTxnList}
                  totalPaid={payment.totalPaid}
                  outstanding={payment.outStanding}
                  invoicePayerFK={payment.id}
                  actions={paymentActionsProps}
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
        >
          <AddPayment handleSubmit={this.onSubmit} />
        </CommonModal>
        <CommonModal
          open={showAddCrNote}
          title='Add Credit Note'
          onConfirm={this.closeAddCrNoteModal}
          onClose={this.closeAddCrNoteModal}
          maxWidth='lg'
        >
          <AddCrNote />
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
      </div>
    )
  }
}

export default withStyles(styles)(PaymentDetails)
