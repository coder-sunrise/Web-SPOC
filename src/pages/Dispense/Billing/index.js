import React, { Component } from 'react'
import { connect } from 'dva'
import { withFormik } from 'formik'
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

const bannerStyle = {
  zIndex: 1000,
  paddingLeft: 16,
  paddingRight: 16,
}

@connect(({ billing, dispense }) => ({ billing, dispense }))
@withFormik({
  mapPropsToValues: ({ billing }) => billing.entity || billing.default,
  handleSubmit: (values, formikBag) => {
    console.log({ values })
  },
})
class Billing extends Component {
  state = {
    showCoPaymentModal: false,
    showAddPaymentModal: false,
  }

  backToDispense = () => {
    const { history } = this.props
    console.log({ history })
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
    const { showCoPaymentModal, showAddPaymentModal } = this.state
    const { classes, values } = this.props
    console.log({ values })
    return (
      <div>
        <PatientBanner style={bannerStyle} />
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
                handleCoPaymentClick={this.toggleCoPaymentModal}
                values={values}
              />
            </GridContainer>
            <GridContainer item md={4} justify='center' alignItems='flex-start'>
              <InvoiceSummary
                handleAddPaymentClick={this.toggleAddPaymentModal}
                values={values}
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
