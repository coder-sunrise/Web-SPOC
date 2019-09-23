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
  podoPayment, purchaseOrderDetails,
}))
@withFormikExtend({
  displayName: 'podoPayment',
  enableReinitialize: true,
  mapPropsToValues: ({ podoPayment }) => {
    return podoPayment
  },
})
class index extends PureComponent {
  componentDidMount () {
    this.props.dispatch({
      type: 'podoPayment/queryPodoPayment',
    })

    this.props.dispatch({
      type: 'podoPayment/setPurchaseOrderDetails',
      payload: this.props.purchaseOrderDetails,
    })
  }

  render () {
    const { purchaseOrderDetails } = this.props
    const { status } = purchaseOrderDetails
    const isEditable = isPOStatusFinalized(status)
    return (
      <React.Fragment>
        <GridContainer>
          <Header {...this.props} />
          <Grid isEditable={!isEditable} {...this.props} />
        </GridContainer>
        <div style={{ textAlign: 'center' }}>
          <ProgressButton
            // submitKey='medicationDetail/submit'
            // onClick={handleSubmit}
            disabled={isEditable}
          />
          <Button
            color='danger'
            disabled={isEditable}
          >Cancel
          </Button>
        </div>
      </React.Fragment>
    )
  }
}

export default index
