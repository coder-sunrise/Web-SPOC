import React, { Component } from 'react'
// material ui
import { withStyles } from '@material-ui/core'
// sub components
import PaymentCard from './PaymentCard'
// styles
import styles from './styles'
import { PayerType } from './variables'

class PaymentDetails extends Component {
  render () {
    const { classes } = this.props
    return (
      <div className={classes.container}>
        <PaymentCard
          payerType={PayerType.PATIENT}
          payerName='Lee Tian Kang'
          payments={[
            {
              type: 'Payment',
              itemID: 'RE/000001',
              date: '07 May 2019',
              amount: 100,
            },
            {
              type: 'Write Off',
              itemID: 'RE/000001',
              date: '07 May 2019',
              amount: 100,
            },
          ]}
        />
        <PaymentCard
          payerType={PayerType.GOVT_COPAYER}
          payerName='CHAS'
          payments={[
            {
              type: 'Payment',
              itemID: 'RE/000001',
              date: '07 May 2019',
              amount: 100,
            },
          ]}
        />
        <PaymentCard
          payerType={PayerType.COPAYER}
          payerName='medisys'
          payments={[
            {
              type: 'Payment',
              itemID: 'RE/000001',
              date: '07 May 2019',
              amount: 100,
            },
          ]}
        />
      </div>
    )
  }
}

export default withStyles(styles)(PaymentDetails)
