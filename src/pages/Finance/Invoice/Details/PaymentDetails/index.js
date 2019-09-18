import React, { Component } from 'react'
import { connect } from 'dva'
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

@connect(({ invoicePayment }) => ({
  invoicePayment,
}))
@withFormik({
  name: 'invoicePayment',
  mapPropsToValues: ({ invoicePayment }) => {
    console.log('mapPropsToValues', invoicePayment)
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

  onAddCrNoteClick = () => this.setState({ showAddCrNote: true })

  onWriteOffClick = () => this.setState({ showWriteOff: true })

  closeAddPaymentModal = () => this.setState({ showAddPayment: false })

  closeAddCrNoteModal = () => this.setState({ showAddCrNote: false })

  closeWriteOffModal = () => this.setState({ showWriteOff: false })

  closeDeleteConfirmationModal = () =>
    this.setState({ showDeleteConfirmation: false })

  onVoidClick = ({ type, itemID }) => {
    this.setState({
      showDeleteConfirmation: true,
      onVoid: { type, itemID },
    })
  }

  onPrinterClick = ({ currentTarget }) => {
    console.log({ printer: currentTarget })
  }

  render () {
    console.log('PaymentDetails', this.props)
    const { classes, invoiceDetail, values } = this.props
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
          payerName={invoiceDetail.patientName}
          payments={[
            {
              type: 'Payment',
              itemID: 'RE/000001',
              date: '07 May 2019',
              amount: 100,
            },
            {
              type: 'Write Off',
              itemID: 'RE/000001',
              date: '07 May 2019',
              amount: 100,
            },
          ]}
          actions={paymentActionsProps}
        />
        <PaymentCard
          actions={paymentActionsProps}
          payerType={PayerType.GOVT_COPAYER}
          payerName='CHAS'
          payments={[
            {
              type: 'Payment',
              itemID: 'RE/000001',
              date: '07 May 2019',
              amount: 100,
            },
          ]}
        />
        <PaymentCard
          actions={paymentActionsProps}
          payerType={PayerType.COPAYER}
          payerName='medisys'
          payments={[
            {
              type: 'Payment',
              itemID: 'RE/000001',
              date: '07 May 2019',
              amount: 100,
            },
          ]}
        />
        <CommonModal
          open={showAddPayment}
          title='Add Payment'
          onConfirm={this.closeAddPaymentModal}
          onClose={this.closeAddPaymentModal}
        >
          <AddPayment />
        </CommonModal>
        <CommonModal
          open={showAddCrNote}
          title='Add Credit Note'
          onConfirm={this.closeAddCrNoteModal}
          onClose={this.closeAddCrNoteModal}
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
          <WriteOff />
        </CommonModal>

        <CommonModal
          open={showDeleteConfirmation}
          title='Void Payment'
          onConfirm={this.closeDeleteConfirmationModal}
          onClose={this.closeDeleteConfirmationModal}
          maxWidth='sm'
        >
          <DeleteConfirmation {...onVoid} />
        </CommonModal>
      </div>
    )
  }
}

export default withStyles(styles)(PaymentDetails)
