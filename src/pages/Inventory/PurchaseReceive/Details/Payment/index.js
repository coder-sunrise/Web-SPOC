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
import { isPOStatusFinalized } from '../../variables'
import PaymentDetails from './PaymentDetails'
import { navigateDirtyCheck } from '@/utils/utils'

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
    let outstandingAmt = 0
    if (podoPayment.purchaseOrderDetails) {
      const { outstandingAmount } = podoPayment.purchaseOrderDetails
      outstandingAmt = outstandingAmount
    }
    return {
      ...podoPayment,
      outstandingAmt,
    }
  },
  handleSubmit: (values, { props }) => {
    const { dispatch, onConfirm, history } = props
    const { purchaseOrderPayment, currentBizSessionInfo } = values

    let paymentData = purchaseOrderPayment
      .filter((item) => !item.isDeleted)
      .map((x, index) => {
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
              // isCancelled: x.isCancelled,
            },
          }
        }

        return {
          ...x,
          clinicPaymentDto: {
            ...x.clinicPaymentDto,
            // isCancelled: x.isCancelled,
          },
        }
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
          history.push('/inventory/pr')
          dispatch({
            type: `formik/clean`,
            payload: 'purchaseOrderDetails',
          })
        }
      }
    })
  },
})
class index extends PureComponent {
  componentDidMount () {
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

  recalculateOutstandingAmount = (type, value) => {
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
    // const { showPODOPaymentModal } = this.state
    const poStatus = purchaseOrderDetails
      ? purchaseOrderDetails.purchaseOrderStatusFK
      : 1
    const isEditable = isPOStatusFinalized(poStatus)
    return (
      <React.Fragment>
        <GridContainer>
          <Header {...this.props} />
          <Grid
            isEditable={!isEditable}
            {...this.props}
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
            disabled={isEditable}
            onClick={navigateDirtyCheck(this.onClickCancelPayment)}
          >
            Cancel
          </ProgressButton>
          <ProgressButton
            onClick={this.props.handleSubmit}
            disabled={isEditable}
          />
        </div>
      </React.Fragment>
    )
  }
}

export default withStyles(styles, { withTheme: true })(index)
