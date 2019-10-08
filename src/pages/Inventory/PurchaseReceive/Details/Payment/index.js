import React, { PureComponent } from 'react'
import { connect } from 'dva'
import {
  GridContainer,
  Button,
  withFormikExtend,
  ProgressButton,
} from '@/components'
import Header from './Header'
import Grid from './Grid'
import { isPOStatusFinalized } from '../../variables'

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
})
class index extends PureComponent {
  componentDidMount () {
    this.props.dispatch({
      type: 'podoPayment/queryPodoPayment',
      payload: this.props.purchaseOrderDetails,
    })
  }

  render () {
    const { purchaseOrderDetails } = this.props
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
        <div style={{ textAlign: 'center' }}>
          <ProgressButton
            onClick={this.props.handleSubmit}
            disabled={isEditable}
          />
          {/* <Button color='danger' disabled={isEditable}>
            Cancel
          </Button> */}
        </div>
      </React.Fragment>
    )
  }
}

export default index
