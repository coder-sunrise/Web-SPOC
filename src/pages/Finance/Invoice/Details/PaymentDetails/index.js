import React, { Component } from 'react'
// material ui
import { withStyles } from '@material-ui/core'
// common components
import { CommonModal } from '@/components'
// sub components
import { AddPayment } from 'medisys-components'
import AddCrNote from '../../components/modal/AddCrNote'
import WriteOff from '../../components/modal/WriteOff'
import PaymentCard from './PaymentCard'
// styles
import styles from './styles'
import { PayerType } from './variables'

class PaymentDetails extends Component {
  state = {
    showAddPayment: false,
    showAddCrNote: false,
    showWriteOff: false,
  }

  onAddPaymentClick = () => this.setState({ showAddPayment: true })

  onAddCrNoteClick = () => this.setState({ showAddCrNote: true })

  onWriteOffClick = () => this.setState({ showWriteOff: true })

  closeAddPaymentModal = () => this.setState({ showAddPayment: false })

  closeAddCrNoteModal = () => this.setState({ showAddCrNote: false })

  closeWriteOffModal = () => this.setState({ showWriteOff: false })

  render () {
    const { classes } = this.props
    const paymentActionsProps = {
      handleAddPayment: this.onAddPaymentClick,
      handleAddCrNote: this.onAddCrNoteClick,
      handleWriteOff: this.onWriteOffClick,
    }
    const { showAddPayment, showAddCrNote, showWriteOff } = this.state

    return (
      <div className={classes.container}>
        <PaymentCard
          payerType={PayerType.PATIENT}
          payerName='Lee Tian Kang'
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
      </div>
    )
  }
}

export default withStyles(styles)(PaymentDetails)
