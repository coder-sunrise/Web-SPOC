import React, { Component } from 'react'
import { connect } from 'dva'
// material ui
import { Paper, withStyles } from '@material-ui/core'
import ArrowBack from '@material-ui/icons/ArrowBack'
import SolidExpandMore from '@material-ui/icons/ArrowDropDown'
// common components
import { Accordion, Button, CommonModal, GridContainer } from '@/components'
import { AddPayment } from '@/components/_medisys'
// sub component
import PatientBanner from '@/pages/PatientDashboard/Banner'
import DispenseDetails from '../DispenseDetails'
import ApplyClaims from './components/ApplyClaims'
import InvoiceSummary from './components/InvoiceSummary'
// page modal
import EditClaimSeq from './modal/EditClaimSeq'
import CoPayment from './modal/CoPayment'
// import AddPayment from './AddPayment'
// model
import model from '../models/billing'

window.g_app.replaceModel(model)

const styles = (theme) => ({
  paperContent: {
    padding: theme.spacing.unit,
  },
  paymentButton: {
    margin: theme.spacing.unit * 2,
    textAlign: 'right',
  },
})

@connect(({ billing, dispense }) => ({ billing, dispense }))
class Billing extends Component {
  state = {
    showClaimSeqModal: false,
    showCoPaymentModal: false,
    showAddPaymentModal: false,
  }

  backToDispense = () => {
    const { history } = this.props
    console.log({ history })
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

  onSubmit = (values) => {
    console.log('addpayment', { values })
  }

  render () {
    const {
      showClaimSeqModal,
      showCoPaymentModal,
      showAddPaymentModal,
    } = this.state
    const { classes, billing } = this.props
    return (
      <div>
        <PatientBanner style={{}} patientInfo={billing.patientInfo} />
        <div style={{ padding: 8 }}>
          <Accordion
            leftIcon
            expandIcon={<SolidExpandMore fontSize='large' />}
            collapses={[
              {
                title: <h5 style={{ paddingLeft: 8 }}>Dispensing Details</h5>,
                content: (
                  <GridContainer direction='column'>
                    <DispenseDetails {...this.props} />
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
          <EditClaimSeq />
        </CommonModal>
        <CommonModal
          open={showCoPaymentModal}
          title='Add Copayer'
          onConfirm={this.toggleCoPaymentModal}
          onClose={this.toggleCoPaymentModal}
        >
          <CoPayment />
        </CommonModal>
        <CommonModal
          open={showAddPaymentModal}
          title='Add Payment'
          onClose={this.toggleAddPaymentModal}
        >
          <AddPayment handleSubmit={this.onSubmit} />
        </CommonModal>
      </div>
    )
  }
}

export default withStyles(styles, { name: 'BillingScreen' })(Billing)
