import React, { useState, useCallback } from 'react'
// material ui
import { withStyles, IconButton } from '@material-ui/core'
import Delete from '@material-ui/icons/Delete'
// ant design
import { Divider } from 'antd'
// common components
import {
  Button,
  CardContainer,
  GridContainer,
  GridItem,
  TextField,
} from '@/components'
import DeleteWithPopover from './DeleteWithPopover'
// utils
import { roundToTwoDecimals } from '@/utils/utils'

const styles = () => ({
  rightAlign: {
    textAlign: 'right',
  },
  invoiceButton: {
    paddingLeft: 0,
  },
  addPaymentButton: {
    paddingRight: 0,
    marginRight: 0,
  },
  currencyValue: {
    fontWeight: 500,
    color: 'darkblue',
  },
})

const parseToTwoDecimalString = (value = 0.0) => value.toFixed(2)

const InvoiceSummary = ({
  classes,
  handleAddPaymentClick,
  handleDeletePaymentClick,
  handlePrintInvoiceClick,
  disabled,
  values,
}) => {
  const [
    cancelReason,
    setCancelReason,
  ] = useState('')
  const { invoicePayment, invoice } = values
  const { gstValue, gstAmount, totalAftGst, invoiceNo } = invoice
  const handleConfirmDelete = useCallback(
    (id) => {
      handleDeletePaymentClick(id, cancelReason)
    },
    [
      cancelReason,
    ],
  )

  const onCancelReasonChange = (event) => {
    setCancelReason(event.target.value)
  }

  const shouldDisableAddPayment = () => {
    if (disabled) return disabled
    const totalPaid = values.invoicePayment.reduce(
      (total, payment) =>
        !payment.isCancelled ? total + payment.totalAmtPaid : total,
      0,
    )
    return values.finalPayable < totalPaid
  }

  return (
    <React.Fragment>
      <GridItem md={12}>
        <h4 style={{ textAlign: 'center' }}>Invoice Summary: {invoiceNo}</h4>
      </GridItem>
      <GridItem md={10}>
        <CardContainer hideHeader>
          <GridContainer justify='space-between'>
            <GridItem md={6}>
              <h5>
                GST ({parseToTwoDecimalString(roundToTwoDecimals(gstValue))}%)
              </h5>
            </GridItem>
            <GridItem md={6} className={classes.rightAlign}>
              <h5 className={classes.currencyValue}>
                $ {parseToTwoDecimalString(roundToTwoDecimals(gstAmount))}
              </h5>
            </GridItem>
            <GridItem md={6}>
              <h5>Final Bill</h5>
            </GridItem>
            <GridItem md={6} className={classes.rightAlign}>
              <h5 className={classes.currencyValue}>
                ${parseToTwoDecimalString(roundToTwoDecimals(totalAftGst))}
              </h5>
            </GridItem>
            <GridItem md={6}>
              <h5 style={{ fontWeight: 500 }}>Total Claims</h5>
            </GridItem>
            <GridItem md={6} className={classes.rightAlign}>
              <h5 className={classes.currencyValue}>
                $ {parseToTwoDecimalString(values.finalClaim)}
              </h5>
            </GridItem>
            <GridItem md={12}>
              <Divider
                style={{
                  width: '100%',
                  height: 1,
                  margin: '12px 0',
                }}
              />
            </GridItem>
            <GridItem md={6}>
              <h5 style={{ fontWeight: 500 }}>Final Payable</h5>
            </GridItem>
            <GridItem md={6} className={classes.rightAlign}>
              <h5 className={classes.currencyValue}>
                $ {parseToTwoDecimalString(values.finalPayable)}
              </h5>
            </GridItem>
          </GridContainer>
        </CardContainer>
      </GridItem>
      <GridItem md={10}>
        <CardContainer hideHeader>
          <h4 style={{ fontWeight: 500 }}>Payment</h4>
          <GridContainer justify='space-between'>
            <GridItem container md={12}>
              {invoicePayment
                .filter((item) => !item.isCancelled)
                .map((item) => (
                  <React.Fragment>
                    <GridItem md={11}>
                      <h5>Receipt No: {item.receiptNo || 'N/A'}</h5>
                    </GridItem>
                    <GridItem md={1}>
                      <DeleteWithPopover
                        disabled={!item.id}
                        index={item.id}
                        title='Cancel Payment'
                        contentText='Confirm to cancel this payment?'
                        extraCmd={
                          <TextField
                            label='Cancel Reason'
                            onChange={onCancelReasonChange}
                          />
                        }
                        onConfirmDelete={handleConfirmDelete}
                      />
                    </GridItem>

                    {item.invoicePaymentMode.map((payment) => (
                      <React.Fragment>
                        <GridItem md={1} />
                        <GridItem md={5}>
                          <p>{payment.paymentMode}</p>
                        </GridItem>
                        <GridItem md={6} className={classes.rightAlign}>
                          <p className={classes.currencyValue}>
                            $ {parseToTwoDecimalString(payment.amt)}
                          </p>
                        </GridItem>
                      </React.Fragment>
                    ))}
                  </React.Fragment>
                ))}
            </GridItem>
            <GridItem md={12}>
              <Divider
                style={{
                  width: '100%',
                  height: 1,
                  margin: '12px 0',
                }}
              />
            </GridItem>
            <GridItem md={6}>
              <Button
                color='primary'
                simple
                size='sm'
                className={classes.invoiceButton}
                disabled={disabled}
                onClick={handlePrintInvoiceClick}
              >
                Print Invoice
              </Button>
            </GridItem>
            <GridItem md={6} className={classes.rightAlign}>
              <Button
                color='primary'
                simple
                size='sm'
                className={classes.addPaymentButton}
                onClick={handleAddPaymentClick}
                disabled={shouldDisableAddPayment()}
              >
                Add Payment
              </Button>
            </GridItem>
          </GridContainer>
        </CardContainer>
      </GridItem>
    </React.Fragment>
  )
}

export default withStyles(styles, { name: 'InvoiceSummary' })(InvoiceSummary)
