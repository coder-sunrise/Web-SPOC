import React, { PureComponent } from 'react'
import { connect } from 'dva'
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
    return podoPayment
  },
  handleSubmit: (values, { props }) => {
    const { purchaseOrderPayment, currentBizSessionInfo } = values
    const { dispatch } = props
    purchaseOrderPayment.filter((x) => x.isNew).map((x) => {
      delete x.id
      const paymentPayload = {
        purchaseOrderFK: values.id,
        sequence: 1,
        clinicPaymentDto: {
          ...x,
          createdOnBizSessionFK: currentBizSessionInfo.id,
          clinicPaymentTypeFK: 1,
        },
      }

      dispatch({
        type: 'podoPayment/upsert',
        payload: { ...paymentPayload },
      })
    })
  },
  // handleSubmit: (values, { props }) => {
  // const { purchaseOrderPayment } = values
  // const {
  //   paymentNo,
  //   paymentDate,
  //   paymentModeFK,
  //   paymentAmount,
  //   referenceNo,
  // } = purchaseOrderPayment
  // const { dispatch, onConfirm, refreshPodoPayment } = props

  // dispatch({
  //   type: 'podoPayment/upsert',
  //   payload: {
  //     purchaseOrderFK: props.values.id,
  //     sequence: 1,
  //     clinicPaymentDto: {
  //       createdOnBizSessionFK: props.values.currentBizSessionInfo.id,
  //       clinicPaymentTypeFK: 1,
  //       paymentNo,
  //       paymentDate,
  //       paymentModeFK,
  //       paymentAmount,
  //       referenceNo,
  //     },
  //   },
  // }).then((r) => {
  //   if (r) {
  //     if (onConfirm) onConfirm()
  //     dispatch({
  //       type: 'purchaseOrderDetails/refresh',
  //       payload: {
  //         id: props.values.id,
  //       },
  //     }).then(setTimeout(() => refreshPodoPayment(), 500))
  //   }
  // })
  // },
})
class index extends PureComponent {
  // state = {
  //   showPODOPaymentModal: false,
  // }

  componentDidMount () {
    this.refreshPodoPayment()
  }

  refreshPodoPayment = () => {
    this.props.dispatch({
      type: 'podoPayment/queryPodoPayment',
      payload: this.props.purchaseOrderDetails,
    })
  }

  // onClickAddPayment = () => this.setState({ showPODOPaymentModal: true })

  // onCloseAddPayment = () => this.setState({ showPODOPaymentModal: false })

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
          <Grid isEditable={!isEditable} {...this.props} />
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
            onClick={this.props.handleSubmit}
            disabled={isEditable}
          />
          <Button color='danger' disabled={isEditable}>
            Cancel
          </Button>
        </div>
      </React.Fragment>
    )
  }
}

export default withStyles(styles, { withTheme: true })(index)
