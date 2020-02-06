import React, { PureComponent } from 'react'
import { connect } from 'dva'
import _ from 'lodash'
import { withStyles } from '@material-ui/core'
import basicStyle from 'mui-pro-jss/material-dashboard-pro-react/layouts/basicLayout'
import { GridContainer, withFormikExtend, ProgressButton } from '@/components'
import Header from './Header'
import Grid from './Grid'
import { INVOICE_STATUS } from '@/utils/constants'
import { isPOStatusFinalized } from '../../variables'
import { navigateDirtyCheck, roundTo } from '@/utils/utils'
import AuthorizedContext from '@/components/Context/Authorized'

const styles = (theme) => ({
  ...basicStyle(theme),
})

@connect(({ podoPayment, purchaseOrderDetails }) => ({
  podoPayment,
  purchaseOrderDetails,
}))
@withFormikExtend({
  displayName: 'podoPayment',
  enableReinitialize: true,
  mapPropsToValues: ({ podoPayment }) => {
    let outstandingAmount = {}
    let newPurchaseOrderPayment = []
    if (podoPayment && podoPayment.purchaseOrderDetails) {
      const osAmt = roundTo(
        podoPayment.purchaseOrderDetails.outstandingAmount || 0,
      )
      outstandingAmount = {
        outstandingAmt: osAmt,
        currentOutstandingAmt: osAmt,
        invoiceAmount: podoPayment.purchaseOrderDetails.totalAftGst,
      }

      const { purchaseOrderPayment } = podoPayment
      newPurchaseOrderPayment = purchaseOrderPayment.map((o) => {
        let tempOutstandingAmount = {}
        if (o.id) {
          tempOutstandingAmount = {
            outstandingAmt: o.paymentAmount,
          }
        }
        return {
          ...o,
          ...tempOutstandingAmount,
        }
      })
    }

    return {
      ...podoPayment,
      ...outstandingAmount,
      purchaseOrderPayment: newPurchaseOrderPayment,
    }
  },
  handleSubmit: (values, { props }) => {
    const { dispatch, onConfirm, history } = props
    const { purchaseOrderPayment, currentBizSessionInfo } = values

    let paymentData = purchaseOrderPayment.map((x, index) => {
      x.isCancelled = x.isDeleted
      if (_.has(x, 'isNew')) {
        return {
          purchaseOrderFK: values.id,
          sequence: index + 1,
          clinicPaymentDto: {
            ...x,
            id: x.cpId,
            concurrencyToken: x.cpConcurrencyToken,
            createdOnBizSessionFK: currentBizSessionInfo.id,
            clinicPaymentTypeFK: 1,
            transactionOnBizSessionFK: currentBizSessionInfo.id,
            isCancelled: x.isCancelled,
            paymentMode: x.paymentModeTypeName,
            creditCardType: x.creditCardTypeName,
          },
        }
      }

      delete x.isDeleted
      return {
        ...x,
        clinicPaymentDto: {
          ...x.clinicPaymentDto,
          cancelReason: x.cancelReason,
          isCancelled: x.isCancelled,
        },
      }
    })

    paymentData.forEach((o) => {
      o.clinicPaymentDto.paymentModeFK =
        o.clinicPaymentDto.creditCardId || undefined
      o.clinicPaymentDto.creditCardTypeFK =
        o.clinicPaymentDto.typeId || undefined
    })

    dispatch({
      type: 'podoPayment/upsertPodoPayment',
      payload: {
        purchaseOrderId: values.id,
        paymentData,
      },
    }).then((r) => {
      if (r) {
        if (onConfirm) onConfirm()
        if (r) {
          dispatch({
            type: 'purchaseOrderDetails/queryPurchaseOrder',
            payload: {
              id: props.purchaseOrderDetails.id,
            },
          }).then((v) => {
            dispatch({
              type: 'podoPayment/queryPodoPayment',
              payload: {
                ...v,
              },
            })
          })
        }
      }
    })
  },
})
class index extends PureComponent {
  componentDidMount = () => {
    this.refreshPodoPayment()
  }

  refreshPodoPayment = () => {
    this.props.dispatch({
      type: 'podoPayment/queryPodoPayment',
      payload: this.props.purchaseOrderDetails,
    })
  }

  onClickCancelPayment = () => {
    const { dispatch, values, resetForm, history } = this.props
    resetForm()
    dispatch({
      type: 'purchaseOrderDetails/refresh',
      payload: {
        id: values.id,
      },
    }).then(() => {
      setTimeout(() => this.refreshPodoPayment(), 500)
      history.push('/inventory/pr')
    })
  }

  // onClickAddPayment = () => this.setState({ showPODOPaymentModal: true })

  // onCloseAddPayment = () => this.setState({ showPODOPaymentModal: false })

  recalculateOutstandingAmount = (type, value = 0) => {
    const { values, setValues } = this.props
    if (type === 'add') {
      const currentOutstandingAmt = values.outstandingAmt - value
      setValues({
        ...values,
        currentOutstandingAmt,
      })
    } else {
      const currentOutstandingAmt = values.currentOutstandingAmt + value
      setValues({
        ...values,
        currentOutstandingAmt,
      })
    }
  }

  render () {
    const { purchaseOrderDetails, values } = this.props
    const { outstandingAmt, currentOutstandingAmt } = values
    const { purchaseOrder: po } = purchaseOrderDetails
    const poStatus = po ? po.purchaseOrderStatusFK : 1
    const isWriteOff = po
      ? po.invoiceStatusFK === INVOICE_STATUS.WRITEOFF
      : false
    const isEditable = isPOStatusFinalized(poStatus)
    const allowEdit = () => {
      if (isWriteOff) return false
      return true
    }
    return (
      <AuthorizedContext.Provider
        value={{
          rights: allowEdit() ? 'enable' : 'disable',
          // rights: 'disable',
        }}
      >
        <GridContainer>
          <Header {...this.props} />
          <Grid
            {...this.props}
            isEditable={isEditable}
            recalculateOutstandingAmount={this.recalculateOutstandingAmount}
          />
        </GridContainer>
        {/* <CommonModal
          open={showPODOPaymentModal}
          title='Add Payment'
          maxWidth='md'
          bodyNoPadding
          onConfirm={this.onCloseAddPayment}
          onClose={this.onCloseAddPayment}
        >
          <PaymentDetails
            refreshPodoPayment={this.refreshPodoPayment}
            {...this.props}
          />
        </CommonModal> */}
        {/* <Button
          disabled={isEditable}
          onClick={this.onClickAddPayment}
          // hideIfNoEditRights
          color='info'
          link
        >
          <Add />
          Add Payment
        </Button> */}
        <div style={{ textAlign: 'center' }}>
          <ProgressButton
            color='danger'
            icon={null}
            onClick={navigateDirtyCheck({
              onProceed: this.onClickCancelPayment,
            })}
          >
            Cancel
          </ProgressButton>
          <ProgressButton onClick={this.props.handleSubmit} />
        </div>
      </AuthorizedContext.Provider>
    )
  }
}

export default withStyles(styles, { withTheme: true })(index)
