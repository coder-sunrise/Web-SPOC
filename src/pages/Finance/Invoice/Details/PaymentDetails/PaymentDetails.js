import React, { Fragment } from 'react'
import { withStyles } from '@material-ui/core'

import { GridContainer, GridItem } from '@/components'
import styles from './styles'
import { PAYMENT_MODE } from '@/utils/constants'
import { currencyFormatter } from '@/utils/utils'

const PaymentDetails = ({ paymentModeDetails, classes }) => {
  return (
    <Fragment>
      <GridContainer className={classes.container}>
        {paymentModeDetails.map((mode) => {
          const modeName =
            mode.paymentModeFK === PAYMENT_MODE.CREDIT_CARD
              ? 'Credit Card (Visa/Master/AMEX/DINER)'
              : mode.paymentMode
          return (
            <GridContainer className={classes.container}>
              <GridItem xs={12} container>
                <GridItem xs={8}>
                  <p>
                    <b>{modeName}</b>
                  </p>
                  <p>Remarks</p>
                </GridItem>
                <GridItem xs={2}>
                  <p className={classes.currency}>
                    {mode.amt ? currencyFormatter(mode.amt) : 'N/A'}
                  </p>
                  <p>{mode.remark || '-'}</p>
                </GridItem>
              </GridItem>
            </GridContainer>
          )
        })}
      </GridContainer>
    </Fragment>
  )
}

export default withStyles(styles, { name: 'PaymentDetails' })(PaymentDetails)
