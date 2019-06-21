import React, { Component } from 'react'
// material ui
import { Paper, withStyles } from '@material-ui/core'
// common components
import { Accordion, Button, CommonModal, GridContainer } from '@/components'
// sub component
import PatientBanner from '../components/PatientBanner'
import DispenseDetails from '../components/DispenseDetails'
import ApplyClaims from './components/ApplyClaims'
import InvoiceSummary from './components/InvoiceSummary'

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
  }

  toggleClaimSequenceModal = () => {
    const { showClaimSeqModal } = this.state
    this.setState({ showClaimSeqModal: !showClaimSeqModal })
  }

  render () {
    const { showClaimSeqModal } = this.state
    const { classes } = this.props
    return (
      <div>
        <PatientBanner />
        <div style={{ padding: 8 }}>
          <Accordion
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
              />
            </GridContainer>
            <GridContainer item md={4} justify='center' alignItems='flex-start'>
              <InvoiceSummary />
            </GridContainer>
          </GridContainer>
        </Paper>
        <div className={classes.paymentButton}>
          <Button color='primary'>Complete Payment</Button>
        </div>
        <CommonModal
          open={showClaimSeqModal}
          title='Edit Claim Sequence'
          onConfirm={this.toggleClaimSequenceModal}
          onClose={this.toggleClaimSequenceModal}
        >
          <div>Claim Sequence</div>
        </CommonModal>
      </div>
    )
  }
}

export default withStyles(styles, { name: 'BillingScreen' })(Billing)
