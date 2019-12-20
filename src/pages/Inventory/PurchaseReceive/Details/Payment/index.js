import React, { PureComponent } from 'react'
import { connect } from 'dva'
import _ from 'lodash'
import { withStyles } from '@material-ui/core'
import basicStyle from 'mui-pro-jss/material-dashboard-pro-react/layouts/basicLayout'
import Add from '@material-ui/icons/Add'
import {
  GridContainer,
  Button,
  withFormikExtend,
  ProgressButton,
  CommonModal,
} from '@/components'
import Header from './Header'
import Grid from './Grid'
import { INVOICE_STATUS } from '@/utils/constants'
import { isPOStatusFinalized } from '../../variables'
import PaymentDetails from './PaymentDetails'
import { navigateDirtyCheck } from '@/utils/utils'
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
    if (
      podoPayment &&
      podoPayment.purchaseOrderDetails &&
      podoPayment.purchaseOrderDetails.outstandingAmount
    ) {
      outstandingAmount = {
        outstandingAmt: podoPayment.purchaseOrderDetails.outstandingAmount,
      }
    }
    return {
      ...podoPayment,
      ...outstandingAmount,
    }
  },
  handleSubmit: (values, { props }) => {
    const { dispatch, onConfirm, history } = props
    const { purchaseOrderPayment, currentBizSessionInfo } = values

    let paymentData = purchaseOrderPayment.map((x, index) => {
      x.isCancelled = x.isDeleted
      delete x.isDeleted
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
          },
        }
      }

      return {
        ...x,
        clinicPaymentDto: {
          ...x.clinicPaymentDto,
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
      const outstandingAmt = values.outstandingAmt - value
      setValues({
        ...values,
        outstandingAmt,
      })
    } else {
      const outstandingAmt = values.outstandingAmt + value
      setValues({
        ...values,
        outstandingAmt,
      })
    }
  }

  render () {
    const { purchaseOrderDetails } = this.props
    const { purchaseOrder: po } = purchaseOrderDetails
    const poStatus = po ? po.purchaseOrderStatusFK : 1
    const isWriteOff = po
      ? po.invoiceStatusFK === INVOICE_STATUS.WRITEOFF
      : false
    const isEditable = isPOStatusFinalized(poStatus)
    const allowEdit = () => {
      if (poStatus === 6) return false
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
