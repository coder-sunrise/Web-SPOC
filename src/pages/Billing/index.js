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
import { AddPayment, LoadingWrapper, ReportViewer } from '@/components/_medisys'
// sub component
import PatientBanner from '@/pages/PatientDashboard/Banner'
import DispenseDetails from '@/pages/Dispense/DispenseDetails'
import ApplyClaims from './components/ApplyClaims'
import InvoiceSummary from './components/InvoiceSummary'
// utils
import { computeTotalForAllSavedClaim } from './utils'
import { getRemovedUrl, getAppendUrl, roundToTwoDecimals } from '@/utils/utils'
import { INVOICE_ITEM_TYPE } from '@/utils/constants'

// window.g_app.replaceModel(model)

const styles = (theme) => ({
  accordionContainer: {
    paddingTop: theme.spacing(1.5),
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
  paperContent: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    padding: theme.spacing(1),
  },
  paymentButton: {
    margin: theme.spacing(2),
    textAlign: 'right',
  },
  dispenseContainer: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(2),
  },
})

const bannerStyle = {
  zIndex: 1000,
  paddingLeft: 16,
  paddingRight: 16,
}

@connect(({ billing, user, dispense, loading }) => ({
  billing,
  dispense,
  loading,
  user: user.data,
}))
@withFormikExtend({
  notDirtyDuration: 3,
  displayName: 'BillingForm',
  enableReinitialize: true,
  mapPropsToValues: ({ billing }) => {
    try {
      if (billing.entity) {
        const { invoicePayer } = billing.entity
        const finalClaim = invoicePayer.reduce(
          (totalClaim, payer) =>
            totalClaim +
            payer.invoicePayerItem.reduce(
              (subtotal, item) => subtotal + item.claimAmount,
              0,
            ),
          0,
        )
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
      invoicePayer,
      invoicePayment,
      mode,
    } = values

    const { invoiceItems, ...restInvoice } = invoice

    const payload = {
      mode,
      concurrencyToken,
      visitId,
      invoicePayment: invoicePayment
        .filter((item) => {
          if (item.id && item.isCancelled) return true
          if (!item.id) return true
          return false
        })
        .map((item) => ({
          ...item,
          invoicePayerFK: undefined,
        })),
      invoice: restInvoice,
      invoicePayer: invoicePayer
        .map((item, index) => ({ ...item, sequence: index }))
        .filter((payer) => (payer.id ? payer.isModified : true))
        .map((payer) => {
          const {
            schemeConfig,
            _indexInClaimableSchemes,
            _isConfirmed,
            claimableSchemes,
            _isDeleted,
            _isEditing,
            _isValid,
            isModified,
            ...restPayer
          } = payer
          const _payer = {
            ...restPayer,
            isModified: restPayer.id ? isModified : false,
            invoicePayerItem: payer.invoicePayerItem
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
                  invoiceItemTypeFK,
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
                  invoiceItemTypeFK,
                  itemType: INVOICE_ITEM_TYPE[invoiceItemTypeFK],
                  itemName: itemDescription,
                }
                return _invoicePayerItem
              }),
          }
          return _payer
        }),
    }
    // console.log({ payload })
    dispatch({
      type: 'billing/submit',
      payload,
    }).then((response) => {
      if (response) resetForm()
    })
  },
})
class Billing extends Component {
  state = {
    showReport: false,
    showAddPaymentModal: false,
    isEditing: false,
  }

  componentWillUnmount () {
    this.props.dispatch({
      type: 'billing/updateState',
      payload: {
        entity: null,
      },
    })
  }

  toggleReport = () => {
    this.setState((preState) => ({ showReport: !preState.showReport }))
  }

  backToDispense = () => {
    const { dispatch } = this.props
    dispatch({
      type: 'billing/backToDispense',
    })
  }

  toggleAddPaymentModal = () => {
    const { showAddPaymentModal } = this.state
    this.setState({ showAddPaymentModal: !showAddPaymentModal })
  }

  handleAddPayment = (payment) => {
    const { values, setFieldValue } = this.props
    const { outstandingBalance, ...rest } = payment
    const invoicePayment = [
      ...values.invoicePayment.filter((item) => item.id),
      rest,
    ]

    setFieldValue('invoicePayment', invoicePayment)
    setFieldValue('invoice.outstandingBalance', outstandingBalance)
    this.toggleAddPaymentModal()
  }

  onExpandDispenseDetails = () => {
    const { dispense } = this.props
    if (!dispense.entity) {
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
    const { invoicePayer = [], payments = [], invoice } = values
    if (invoice === null) return true
    // if (payments.length === 0) return true
    if (invoicePayer.length === 0) return false

    return false
  }

  onSavePaymentClick = async () => {
    const { setFieldValue, handleSubmit } = this.props
    await setFieldValue('mode', 'save')
    handleSubmit()
  }

  onCompletePaymentClick = async () => {
    const { setFieldValue, handleSubmit } = this.props
    await setFieldValue('mode', 'complete')
    handleSubmit()
  }

  handleDeletePayment = (id, cancelReason) => {
    const { values, setFieldValue, user } = this.props
    const { invoicePayment } = values
    if (id === undefined) {
      const _newInvoicePayment = invoicePayment.filter(
        (payment) => payment.id !== undefined,
      )
      setFieldValue('invoicePayment', _newInvoicePayment)
    } else {
      const _newInvoicePayment = invoicePayment.map(
        (payment) =>
          payment.id === id
            ? {
                ...payment,
                isCancelled: true,
                cancelReason,
                cancelDate: new Date(),
                cancelByUserFK: user.id,
              }
            : { ...payment },
      )

      setFieldValue('invoicePayment', _newInvoicePayment)
    }
  }

  render () {
    const { showReport, showAddPaymentModal } = this.state
    const { classes, values, dispense, loading, setFieldValue } = this.props
    const formikBag = {
      values,
      setFieldValue,
    }
    return (
      <LoadingWrapper loading={loading.global} text='Getting billing info...'>
        <PatientBanner style={bannerStyle} />
        <div className={classes.accordionContainer}>
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
                    <Paper elevation={3} className={classes.dispenseContainer}>
                      <DispenseDetails viewOnly values={dispense.entity} />
                    </Paper>
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
                handleDeletePaymentClick={this.handleDeletePayment}
                handlePrintInvoiceClick={this.toggleReport}
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
          <Button color='primary' onClick={this.onSavePaymentClick}>
            Save
          </Button>
          <Button
            color='success'
            disabled={
              this.state.isEditing ||
              values.id === undefined ||
              this.shouldDisableCompletePayment()
            }
            onClick={this.onCompletePaymentClick}
          >
            Complete Payment
          </Button>
        </div>
        <CommonModal
          open={showAddPaymentModal}
          title='Add Payment'
          onClose={this.toggleAddPaymentModal}
          observe='AddPaymentForm'
        >
          <AddPayment
            handleSubmit={this.handleAddPayment}
            invoicePayment={values.invoicePayment}
            invoice={{
              ...values.invoice,
              // finalPayable: roundToTwoDecimals(
              //   values.finalPayable -
              //     values.invoicePayment.reduce(
              //       (totalPaid, payment) =>
              //         !payment.isCancelled
              //           ? totalPaid + payment.totalAmtPaid
              //           : totalPaid,
              //       0,
              //     ),
              // ),
              finalPayable: values.finalPayable,
              totalClaim: values.finalClaim,
            }}
          />
        </CommonModal>
        <CommonModal
          open={showReport}
          onClose={this.toggleReport}
          title='Invoice'
          maxWidth='lg'
        >
          <ReportViewer
            showTopDivider={false}
            reportID={15}
            reportParameters={{
              InvoiceID: values.invoice ? values.invoice.id : '',
            }}
          />
        </CommonModal>
      </LoadingWrapper>
    )
  }
}

export default withStyles(styles, { name: 'BillingScreen' })(Billing)
