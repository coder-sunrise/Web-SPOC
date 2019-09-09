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

@connect(({ purchaseReceivePayment }) => ({
  purchaseReceivePayment,
}))
@withFormikExtend({
  displayName: 'purchaseReceivePayment',
  handleSubmit: (values, { props }) => {},
})
class index extends PureComponent {
  render () {
    const isEditable = true
    console.log('Payment Index', this.props)
    return (
      <React.Fragment>
        <GridContainer>
          <Header {...this.props} />
          <Grid {...this.props} />
        </GridContainer>
        <div style={{ textAlign: 'center' }}>
          <ProgressButton
          //submitKey='medicationDetail/submit'
          //onClick={handleSubmit}
          />
          <Button color='danger'>Cancel</Button>
        </div>
      </React.Fragment>
    )
  }
}

export default index
