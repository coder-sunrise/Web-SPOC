import React from 'react'
import classnames from 'classnames'
// material ui
import { withStyles } from '@material-ui/core'
// common component
import {
  CardContainer,
  GridContainer,
  GridItem,
  NumberInput,
  Popper,
} from '@/components'
// utils
import { PAYMENT_MODE } from '@/utils/constants'
import { currencyFormatter } from '@/utils/utils'

const styles = (theme) => ({
  container: {
    margin: theme.spacing(1),
  },
  currency: {
    color: 'darkblue',
    fontWeight: 500,
  },
  rightAlign: {
    textAlign: 'right',
  },
  paymentModeLabel: {
    cursor: 'default',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
})

const creditCardNChequeNo = (mode) => {
  const { paymentModeFK, chequePayment = {}, creditCardPayment = {} } = mode
  if (paymentModeFK === PAYMENT_MODE.CREDIT_CARD)
    return <p>Card No.: {creditCardPayment.creditCardNo || '-'}</p>
  if (paymentModeFK === PAYMENT_MODE.CHEQUE)
    return <p>Cheque No.: {chequePayment.chequeNo || '-'}</p>
  return null
}

const PaymentDetailsPopover = ({ payment, classes }) => {
  const { paymentMode, amt, remark } = payment
  return (
    <React.Fragment>
      <GridItem md={1} />
      <GridItem md={5} style={{ paddingLeft: 8 }}>
        <Popper
          className={classnames({
            [classes.pooperResponsive]: true,
            [classes.pooperNav]: true,
          })}
          style={{
            width: 350,
          }}
          disabledTransition
          placement='right'
          overlay={
            <CardContainer hideHeader>
              <GridContainer className={classes.container}>
                <GridItem xs={8}>
                  <p>
                    <b>{paymentMode}</b>
                  </p>
                </GridItem>
                <GridItem xs={3}>
                  <p className={classes.currency}>
                    {amt ? currencyFormatter(amt) : 'N/A'}
                  </p>
                </GridItem>
                <GridItem>
                  {creditCardNChequeNo(payment)}
                  <p>Remarks: {remark || '-'}</p>
                </GridItem>
              </GridContainer>
            </CardContainer>
          }
        >
          <p className={classes.paymentModeLabel}>{payment.paymentMode}</p>
        </Popper>
      </GridItem>
      <GridItem md={6} className={classes.rightAlign}>
        <NumberInput currency text value={payment.amt} />
      </GridItem>
    </React.Fragment>
  )
}

export default withStyles(styles, { name: 'PaymentDetailsPopover' })(
  PaymentDetailsPopover,
)
