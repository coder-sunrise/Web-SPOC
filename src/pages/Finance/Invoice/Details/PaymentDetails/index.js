import React, { Component } from 'react'
import { connect } from 'dva'
import _ from 'lodash'
// material ui
import { withStyles } from '@material-ui/core'
// common components
import { CommonModal, withFormik } from '@/components'
// sub components
import { AddPayment } from 'medisys-components'
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
  mapPropsToValues: ({ invoicePayment }) => {
    return invoicePayment.entity || invoicePayment.default
  },
})
class PaymentDetails extends Component {
  state = {
    showAddPayment: false,
    showAddCrNote: false,
    showWriteOff: false,
    showDeleteConfirmation: false,
    onVoid: {},
  }

  onAddPaymentClick = () => this.setState({ showAddPayment: true })

  onWriteOffClick = () => this.setState({ showWriteOff: true })

  closeAddPaymentModal = () => this.setState({ showAddPayment: false })

  closeAddCrNoteModal = () => this.setState({ showAddCrNote: false })

  closeWriteOffModal = () => {
    this.setState({ showWriteOff: false })
  }

  closeDeleteConfirmationModal = () =>
    this.setState({ showDeleteConfirmation: false })

  onVoidClick = ({ id, type, itemID }) => {
    this.setState({
      showDeleteConfirmation: true,
      onVoid: { id, type, itemID },
    })
  }

  onAddCrNoteClick = (payerType) => {
    const { dispatch, invoiceDetail, invoicePayment } = this.props
    dispatch({
      type: 'invoiceCreditNote/mapCreditNote',
      payload: {
        invoicePayerFK: payerType,
        invoiceDetail: invoiceDetail.entity,
        creditNote: invoicePayment.entity.creditNote || [],
      },
    })

    this.setState({ showAddCrNote: true })
  }

  onPrinterClick = ({ currentTarget }) => {
    console.log({ printer: currentTarget })
  }

  onSubmit = (paymentData) => {
    this.props.dispatch({
      type: 'invoicePayment/submitAddPayment',
      payload: {
        // TBD
        paymentData: _.toArray(paymentData),
      },
    })
  }

  onSubmitWriteOff = (writeOffData) => {
    this.props.dispatch({
      type: 'invoicePayment/submitWriteOff',
      payload: {
        // TBD
        // invoicePayerFK
        writeOffReason: writeOffData,
      },
    })

    this.closeWriteOffModal()
  }

  onSubmitVoidPayment = (id, reason) => {
    this.props.dispatch({
      type: 'invoicePayment/submitVoidPayment',
      payload: {
        id,
        cancelReason: reason,
      },
    })

    this.closeDeleteConfirmationModal()
  }

  render () {
    const { classes, invoiceDetail, values } = this.props
    const { entity } = invoiceDetail
    const { paymentTxnList } = values
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
        <PaymentCard
          payerType={PayerType.PATIENT}
          payerName={entity ? entity.patientName : 'N/A'}
          payments={paymentTxnList.patientPaymentTxn}
          actions={paymentActionsProps}
          totalPaid={values.totalPaid}
          outstanding={values.outStanding}
        />
        {/* <PaymentCard
          actions={paymentActionsProps}
          payerType={PayerType.GOVT_COPAYER}
          payerName='CHAS'
          payments={paymentTxnList.coPayerPaymentTxn}
        />
        <PaymentCard
          actions={paymentActionsProps}
          payerType={PayerType.COPAYER}
          payerName='medisys'
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
          title='Void Payment'
          onConfirm={this.closeDeleteConfirmationModal}
          onClose={this.closeDeleteConfirmationModal}
          maxWidth='sm'
        >
          <DeleteConfirmation
            handleSubmit={this.onSubmitVoidPayment}
            {...onVoid}
          />
        </CommonModal>
      </div>
    )
  }
}

export default withStyles(styles)(PaymentDetails)
