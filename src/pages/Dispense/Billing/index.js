import React, { Component } from 'react'
import router from 'umi/router'
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
  withFormikExtend,
} from '@/components'
import { AddPayment, LoadingWrapper } from '@/components/_medisys'
// sub component
import PatientBanner from '@/pages/PatientDashboard/Banner'
import DispenseDetails from '../DispenseDetails'
import ApplyClaims from './components/ApplyClaims'
import InvoiceSummary from './components/InvoiceSummary'
// model
import model from '../models/billing'
// utils
import { getAppendUrl } from '@/utils/utils'

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

@connect(({ billing, dispense, loading }) => ({
  billing,
  dispense,
  loading,
}))
@withFormikExtend({
  enableReinitialize: true,
  mapPropsToValues: ({ billing }) => billing.entity || billing.default,
  handleSubmit: (values, formikBag) => {
    console.log({ values })
  },
})
class Billing extends Component {
  state = {
    showCoPaymentModal: false,
    showAddPaymentModal: false,
    isEditing: false,
  }

  backToDispense = () => {
    const { dispatch } = this.props
    const parameters = {
      md2: 'dsps',
      // pid: patient.id,
      // qid: '',
    }
    router.push(getAppendUrl(parameters), '/reception/queue/patientdashboard')
    dispatch({
      type: 'billing/closeModal',
      payload: {
        toDispensePage: true,
      },
    })
  }

  toggleCopayerModal = () => {
    const { showCoPaymentModal } = this.state
    this.setState({ showCoPaymentModal: !showCoPaymentModal })
  }

  toggleAddPaymentModal = () => {
    const { showAddPaymentModal } = this.state
    this.setState({ showAddPaymentModal: !showAddPaymentModal })
  }

  handleAddPayment = (values) => {
    console.log('addpayment', { values })
  }

  onExpandDispenseDetails = (event, panel, expanded) => {
    if (expanded) {
      this.props.dispatch({
        type: 'billing/showDispenseDetails',
      })
    }
  }

  handleIsEditing = (editing) => {
    this.setState({ isEditing: editing })
  }

  render () {
    const { showAddPaymentModal } = this.state
    const { classes, values, dispense, loading, setFieldValue } = this.props
    const formikBag = {
      values,
      setFieldValue,
    }
    console.log({ values })
    return (
      <LoadingWrapper loading={loading.global} text='Getting billing info...'>
        <PatientBanner style={bannerStyle} />
        <div style={{ padding: 8 }}>
          <LoadingWrapper
            linear
            loading={loading.effects['dispense/initState']}
          >
            <Accordion
              leftIcon
              expandIcon={<SolidExpandMore fontSize='large' />}
              onChange={this.onExpandDispenseDetails}
              collapses={[
                {
                  title: <h5 style={{ paddingLeft: 8 }}>Dispensing Details</h5>,
                  content: (
                    <GridContainer direction='column'>
                      <DispenseDetails viewOnly values={dispense.entity} />
                    </GridContainer>
                  ),
                },
              ]}
            />
          </LoadingWrapper>
        </div>

        <Paper className={classes.paperContent}>
          <GridContainer justify='center' alignItems='flex-start'>
            <GridContainer item md={8}>
              <ApplyClaims
                handleAddCopayerClick={this.toggleCopayerModal}
                handleIsEditing={this.handleIsEditing}
                // values={values}
                {...formikBag}
              />
            </GridContainer>
            <GridContainer item md={4} justify='center' alignItems='flex-start'>
              <InvoiceSummary
                disabled={this.state.isEditing}
                handleAddPaymentClick={this.toggleAddPaymentModal}
                values={values}
              />
            </GridContainer>
          </GridContainer>
        </Paper>
        <div className={classes.paymentButton}>
          <Button
            color='info'
            onClick={this.backToDispense}
            disabled={this.state.isEditing}
          >
            <ArrowBack />Dispense
          </Button>
          <Button color='primary' disabled={this.state.isEditing}>
            Complete Payment
          </Button>
        </div>
        <CommonModal
          open={showAddPaymentModal}
          title='Add Payment'
          onClose={this.toggleAddPaymentModal}
        >
          <AddPayment
            handleSubmit={this.handleAddPayment}
            invoice={{
              ...values.invoice,
              finalPayable: values.finalPayable,
              outstandingBalance: values.finalPayable,
            }}
          />
        </CommonModal>
      </LoadingWrapper>
    )
  }
}

export default withStyles(styles, { name: 'BillingScreen' })(Billing)
