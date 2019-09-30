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
    const { rows, ...restValues } = values
    const { dispatch, onConfirm } = props

    console.log('handleSubmit1', values)

    const paymentPayload = {
      purchaseOrderFK: values.id,
      sequence: 1,
      clinicPaymentDto: {},
    }

    dispatch({
      type: 'podoPayment/upsert',
      payload: { ...paymentPayload },
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
    console.log(this.props)
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
          <Button color='danger' disabled={isEditable}>
            Cancel
          </Button>
        </div>
      </React.Fragment>
    )
  }
}

export default index
