import React from 'react'
// material ui
import { withStyles } from '@material-ui/core'
import TrashBin from '@material-ui/icons/Delete'
// common component
import { Button, CardContainer, Tooltip } from '@/components'

const styles = (theme) => ({
  paymentItemHeader: {
    display: 'inline-block',
    textDecoration: 'underline',
    fontWeight: 'bold',
    paddingRight: theme.spacing(2),
  },
  deleteButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(2),
  },
})

const PaymentBase = ({
  classes,
  payment,
  children,
  handleDeletePayment,
  extraLabel = null,
}) => {
  const onClick = () => handleDeletePayment(payment.id)
  return (
    <CardContainer hideHeader>
      <h5 className={classes.paymentItemHeader}>{payment.displayValue}</h5>
      {extraLabel}
      <Tooltip title='Delete payment' placement='top'>
        <Button
          className={classes.deleteButton}
          justIcon
          color='danger'
          onClick={onClick}
        >
          <TrashBin />
        </Button>
      </Tooltip>
      {children}
    </CardContainer>
  )
}

export default withStyles(styles, { name: 'PaymentBase' })(PaymentBase)
