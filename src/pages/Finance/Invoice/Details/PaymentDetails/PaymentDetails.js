import React, { Fragment } from 'react'
import { withStyles } from '@material-ui/core'

import { GridContainer, GridItem } from '@/components'
import styles from './styles'
import { PAYMENT_MODE } from '@/utils/constants'
import { currencyFormatter } from '@/utils/utils'

const PaymentDetails = ({
  paymentModeDetails,
  classes,
  setHoveredRowId,
  id,
}) => {
  const creditCardNChequeNo = (mode) => {
    const { paymentModeFK, chequePayment = {}, creditCardPayment = {} } = mode
    if (paymentModeFK === PAYMENT_MODE.CREDIT_CARD)
      return <p>Card No.: {creditCardPayment.creditCardNo || '-'}</p>
    if (paymentModeFK === PAYMENT_MODE.CHEQUE)
      return <p>Cheque No.: {chequePayment.chequeNo || '-'}</p>
    return null
  }

  const getCreditCardType = (creditCardPayment) => {
    if (creditCardPayment) return creditCardPayment.creditCardType
    return '-'
  }

  return (
    <Fragment>
      <GridContainer
        className={classes.popupContainer}
        onMouseOver={() => setHoveredRowId(id)}
        onMouseOut={() => setHoveredRowId(null)}
        onFocus={() => 0}
        onBlur={() => 0}
      >
        {paymentModeDetails.map((mode) => {
          const modeName =
            mode.paymentModeFK === PAYMENT_MODE.CREDIT_CARD
              ? `Credit Card (${getCreditCardType(mode.creditCardPayment)})`
              : mode.paymentMode
          return (
            <GridContainer className={classes.container}>
              <GridItem xs={12} container>
                <GridItem xs={8}>
                  <p>
                    <b>{modeName}</b>
                  </p>
                </GridItem>
                <GridItem xs={3}>
                  <p className={classes.currency}>
                    {mode.amt ? currencyFormatter(mode.amt) : 'N/A'}
                  </p>
                </GridItem>
                <GridItem>
                  {creditCardNChequeNo(mode)}
                  <p>Remarks: {mode.remark || '-'}</p>
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
