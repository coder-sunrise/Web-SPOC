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
import { getAppendUrl, roundToTwoDecimals } from '@/utils/utils'
import { INVOICE_ITEM_TYPE } from '@/utils/constants'

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
  displayName: 'BillingForm',
  enableReinitialize: true,
  mapPropsToValues: ({ billing }) => {
    try {
      if (billing.entity) {
        const finalClaim = 0

        const finalPayable = roundToTwoDecimals(
          billing.entity.invoice.totalAftGst - finalClaim,
        )

        return { ...billing.entity, finalClaim, finalPayable }
      }

      return billing.default
    } catch (error) {
      console.log({ error })
      return billing.default
    }
  },
  handleSubmit: (values, { props, resetForm }) => {
    const { dispatch } = props
    const {
      concurrencyToken,
      visitId,
      invoice,
      invoicePayers,
      payments,
    } = values

    const { invoiceItems, ...restInvoice } = invoice

    const payload = {
      concurrencyToken,
      visitId,
      payments,
      invoice: restInvoice,
      invoicePayers: invoicePayers.map((payer, index) => {
        const { claimableSchemes, ...restPayer } = payer
        const _payer = {
          ...restPayer,
          sequence: index,
          invoicePayerItems: payer.invoicePayerItems
            .filter((item) => item.claimAmount > 0)
            .map((item) => {
              if (item.invoiceItemFK) {
                return { ...item }
              }
              const {
                invoiceItemFK,
                _claimedAmount,
                disabled,
                itemCode,
                rowIndex,
                notClaimableBySchemeIds,
                invoiceItemTypeFk,
                itemDescription,
                coverage,
                payableBalance,
                id,
                ...restItem
              } = item

              const _invoicePayerItem = {
                ...restItem,
                invoiceItemFK: id,
                payableBalance,
                itemType: INVOICE_ITEM_TYPE[invoiceItemTypeFk],
                itemName: itemDescription,
              }
              return _invoicePayerItem
            }),
        }
        return _payer
      }),
    }
    console.log({ payload })
    dispatch({
      type: 'billing/upsert',
      payload,
    }).then((response) => {
      if (response) {
        resetForm()
        dispatch({
          type: 'billing/closeModal',
        })
      }
    })
  },
})
class Billing extends Component {
  state = {
    showAddPaymentModal: false,
    isEditing: false,
  }

  backToDispense = () => {
    const { dispatch, values } = this.props
    const parameters = {
      md2: 'dsps',
      v: Date.now(),
    }

    dispatch({
      type: 'dispense/unlock',
      payload: {
        id: values.visitId,
      },
    }).then((response) => {
      if (response) {
        router.push(
          getAppendUrl(parameters),
          '/reception/queue/patientdashboard',
        )
        dispatch({
          type: 'billing/closeModal',
          payload: {
            toDispensePage: true,
          },
        })
      }
    })
  }

  toggleAddPaymentModal = () => {
    const { showAddPaymentModal } = this.state
    this.setState({ showAddPaymentModal: !showAddPaymentModal })
  }

  handleAddPayment = (payment) => {
    const { setFieldValue } = this.props
    const { outstandingBalance, ...rest } = payment
    setFieldValue('payments', [
      rest,
    ])
    setFieldValue('invoice.outstandingBalance', outstandingBalance)
    this.toggleAddPaymentModal()
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

  shouldDisableCompletePayment = () => {
    const { values } = this.props
    const { invoicePayers = [], payments = [], invoice } = values
    if (invoice === null) return true
    // if (payments.length === 0) return true
    if (invoicePayers.length === 0) return false

    return false
  }

  render () {
    const { showAddPaymentModal } = this.state
    const {
      classes,
      values,
      dispense,
      loading,
      setFieldValue,
      handleSubmit,
    } = this.props
    const formikBag = {
      values,
      setFieldValue,
    }
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
          <Button
            color='primary'
            disabled={
              this.state.isEditing ||
              values.id === undefined ||
              this.shouldDisableCompletePayment()
            }
            onClick={handleSubmit}
          >
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
            payments={values.payments}
            invoice={{
              ...values.invoice,
              finalPayable: values.invoice.totalAftGst,
              totalClaim: values.finalClaim,
              outstandingBalance: values.finalPayable,
            }}
          />
        </CommonModal>
      </LoadingWrapper>
    )
  }
}

export default withStyles(styles, { name: 'BillingScreen' })(Billing)
