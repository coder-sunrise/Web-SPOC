import React, { PureComponent } from 'react'
import { formatMessage } from 'umi/locale'
import { GridContainer, Button } from '@/components'
import Header from './Header'
import Grid from './Grid'
import { Add } from '@material-ui/icons'

class index extends PureComponent {
  render () {
    return (
      <GridContainer>
        <Header />
        <Grid />
        <Button
          // onClick={this.toggleAddPaymaneModal}
          hideIfNoEditRights
          color='info'
          link
        >
          <Add />
          {formatMessage({
            id: 'inventory.pr.detail.payment.addPayment',
          })}
        </Button>
      </GridContainer>
    )
  }
}

export default index
