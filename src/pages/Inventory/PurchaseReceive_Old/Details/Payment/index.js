import React, { PureComponent } from 'react'
import { connect } from 'dva'
import { formatMessage } from 'umi/locale'
import {
  GridContainer,
  Button,
  EditableTableGrid,
  withFormikExtend,
  ProgressButton,
} from '@/components'
import Header from './Header'
import Grid from './Grid'
import { isPOStatusFinalized } from '../../variables'

@connect(({ purchaseOrderPayment, purchaseOrderDetails }) => ({
  purchaseOrderPayment, purchaseOrderDetails
}))
@withFormikExtend({
  displayName: 'purchaseOrderPayment',
  handleSubmit: (values, { props }) => { },
})
class index extends PureComponent {
  componentDidMount() {
    // this.props.dispatch({
    //   type: 'purchaseOrderPayment/query',
    // })
  }

  render() {
    const { purchaseOrderDetails } = this.props
    const { status } = purchaseOrderDetails.entity.purchaseOrder
    const isEditable = isPOStatusFinalized(status)
    return (
      <React.Fragment>
        <GridContainer>
          <Header {...this.props} />
          <Grid isEditable={isEditable} {...this.props} />
        </GridContainer>
        <div style={{ textAlign: 'center' }}>
          <ProgressButton
            //submitKey='medicationDetail/submit'
            //onClick={handleSubmit}
            disabled={!isEditable}
          />
          <Button
            color='danger'
            disabled={!isEditable}
          >Cancel</Button>
        </div>
      </React.Fragment>
    )
  }
}

export default index
