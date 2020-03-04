import React from 'react'
import classnames from 'classnames'
// formik
import { FastField } from 'formik'
// material ui
import { withStyles } from '@material-ui/core'
import Print from '@material-ui/icons/Print'
// common components
import { Button, GridItem, NumberInput, TextField, Danger } from '@/components'
import DeleteWithPopover from './DeleteWithPopover'
import PaymentDetailsPopover from './PaymentDetailsPopover'

const styles = (theme) => ({
  inline: {
    display: 'inline-block',
  },
  crossed: {
    textDecorationLine: 'line-through',
  },
  errorContainer: {
    textAlign: 'left',
    lineHeight: '1em',
    paddingBottom: theme.spacing(1),
    '& span': {
      fontSize: '.8rem',
    },
  },
  rightAlign: {
    textAlign: 'right',
  },
  printerButton: {
    marginRight: theme.spacing(1),
  },
})

const Payments = ({
  invoicePayment = [],
  classes,
  onCancelReasonChange,
  showError,
  errorMessage,
  handleCancelClick,
  handleConfirmDelete,
  handlePrintReceiptClick,
}) => {
  return invoicePayment.map((item, index) => {
    const titleClass = classnames({
      [classes.crossed]: item.isCancelled,
      [classes.inline]: true,
    })

    const onPrintClick = () => handlePrintReceiptClick(item.id)

    return (
      <React.Fragment key={`payment-${item.id}`}>
        <GridItem md={11}>
          <Button
            justIcon
            color='primary'
            size='sm'
            className={classes.printerButton}
            onClick={onPrintClick}
          >
            <Print />
          </Button>
          <h5 className={titleClass}>Receipt No: {item.receiptNo || 'N/A'}</h5>
        </GridItem>
        <GridItem md={1}>
          <DeleteWithPopover
            index={item.id}
            title='Cancel Payment'
            contentText='Confirm to cancel this payment?'
            extraCmd={
              item.id ? (
                <div className={classes.errorContainer}>
                  <FastField
                    name={`invoicePayment[${index}].cancelReason`}
                    render={(args) => (
                      <TextField
                        label='Cancel Reason'
                        autoFocus
                        {...args}
                        onChange={onCancelReasonChange}
                      />
                    )}
                  />
                  {showError && (
                    <Danger>
                      <span>{errorMessage}</span>
                    </Danger>
                  )}
                </div>
              ) : (
                undefined
              )
            }
            onCancelClick={handleCancelClick}
            onConfirmDelete={handleConfirmDelete}
          />
        </GridItem>

        {item.invoicePaymentMode.map((payment) => (
          <PaymentDetailsPopover payment={payment} />
        ))}
      </React.Fragment>
    )
  })
}

export default withStyles(styles, { name: 'Payments' })(Payments)
