import React, { Component } from 'react'
// material ui
import { Paper, withStyles } from '@material-ui/core'
import ArrowBack from '@material-ui/icons/ArrowBack'
import SolidExpandMore from '@material-ui/icons/ArrowDropDown'
// common components
import { Accordion, Button, CommonModal, GridContainer } from '@/components'
// sub component
import PatientBanner from '../components/PatientBanner'
import DispenseDetails from '../components/DispenseDetails'
import ApplyClaims from './components/ApplyClaims'
import InvoiceSummary from './components/InvoiceSummary'
// page modal
import EditClaimSeq from './modal/EditClaimSeq'
import CoPayment from './modal/CoPayment'
import AddPayment from './AddPayment'

const styles = (theme) => ({
  paperContent: {
    padding: theme.spacing.unit,
  },
  paymentButton: {
    margin: theme.spacing.unit * 2,
    textAlign: 'right',
  },
})

class Billing extends Component {
  state = {
    showClaimSeqModal: false,
    showCoPaymentModal: false,
    showAddPaymentModal: false,
  }

  backToDispense = () => {
    this.props.history.goBack()
  }

  toggleClaimSequenceModal = () => {
    const { showClaimSeqModal } = this.state
    this.setState({ showClaimSeqModal: !showClaimSeqModal })
  }

  toggleCoPaymentModal = () => {
    const { showCoPaymentModal } = this.state
    this.setState({ showCoPaymentModal: !showCoPaymentModal })
  }

  toggleAddPaymentModal = () => {
    const { showAddPaymentModal } = this.state
    this.setState({ showAddPaymentModal: !showAddPaymentModal })
  }

  render () {
    const {
      showClaimSeqModal,
      showCoPaymentModal,
      showAddPaymentModal,
    } = this.state
    const { classes } = this.props
    return (
      <div>
        <PatientBanner />
        <div style={{ padding: 8 }}>
          <Accordion
            leftIcon
            expandIcon={<SolidExpandMore fontSize='large' />}
            collapses={[
              {
                title: <h5 style={{ paddingLeft: 8 }}>Dispensing Details</h5>,
                content: (
                  <GridContainer direction='column'>
                    <DispenseDetails />
                  </GridContainer>
                ),
              },
            ]}
          />
        </div>

        <Paper className={classes.paperContent}>
          <GridContainer justify='center' alignItems='flex-start'>
            <GridContainer item md={8}>
              <ApplyClaims
                handleClaimSeqClick={this.toggleClaimSequenceModal}
                handleCoPaymentClick={this.toggleCoPaymentModal}
              />
            </GridContainer>
            <GridContainer item md={4} justify='center' alignItems='flex-start'>
              <InvoiceSummary
                handleAddPaymentClick={this.toggleAddPaymentModal}
              />
            </GridContainer>
          </GridContainer>
        </Paper>
        <div className={classes.paymentButton}>
          <Button color='info' onClick={this.backToDispense}>
            <ArrowBack />Dispense
          </Button>
          <Button color='primary'>Complete Payment</Button>
        </div>
        <CommonModal
          open={showClaimSeqModal}
          title='Edit Claim Sequence'
          onConfirm={this.toggleClaimSequenceModal}
          onClose={this.toggleClaimSequenceModal}
        >
          {showClaimSeqModal && <EditClaimSeq />}
        </CommonModal>
        <CommonModal
          open={showCoPaymentModal}
          title='Add Copayer'
          onConfirm={this.toggleCoPaymentModal}
          onClose={this.toggleCoPaymentModal}
        >
          {showCoPaymentModal && <CoPayment />}
        </CommonModal>
        <CommonModal
          open={showAddPaymentModal}
          title='Add Payment'
          onConfirm={this.toggleAddPaymentModal}
          onClose={this.toggleAddPaymentModal}
        >
          {showAddPaymentModal && <AddPayment />}
        </CommonModal>
      </div>
    )
  }
}

export default withStyles(styles, { name: 'BillingScreen' })(Billing)
