import React, { useState, useCallback } from 'react'
import classnames from 'classnames'
import numeral from 'numeral'
// formik
import { FastField } from 'formik'
// material ui
import { withStyles } from '@material-ui/core'
// ant design
import { Divider } from 'antd'
// common components
import {
  Button,
  CardContainer,
  GridContainer,
  GridItem,
  TextField,
  Danger,
} from '@/components'
import DeleteWithPopover from './DeleteWithPopover'
// utils
import { roundToTwoDecimals } from '@/utils/utils'
import config from '@/utils/config'

const { currencyFormat } = config

const styles = () => ({
  crossed: {
    textDecorationLine: 'line-through',
  },
  errorContainer: {
    textAlign: 'left',
    lineHeight: '1em',
    paddingBottom: 8,
    '& span': {
      fontSize: '.8rem',
    },
  },
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

const parseToTwoDecimalString = (value = 0.0) => {
  // value.toFixed(2)
  return numeral(value).format(`$${currencyFormat}`)
}

const InvoiceSummary = ({
  classes,
  handleAddPaymentClick,
  handleDeletePaymentClick,
  handlePrintInvoiceClick,
  disabled,
  values,
  setFieldValue,
}) => {
  const errorMessage = 'Cancel reason is required'

  const [
    showError,
    setShowError,
  ] = useState(false)

  const { invoicePayment, invoice } = values
  const { gstValue, gstAmount, totalAftGst, invoiceNo } = invoice

  const handleConfirmDelete = useCallback(
    (id, toggleVisibleCallback) => {
      const payment = invoicePayment.find(
        (item) => parseInt(item.id, 10) === parseInt(id, 10),
      )

      if (payment.cancelReason === '' || payment.cancelReason === undefined) {
        setShowError(true)
      } else {
        toggleVisibleCallback()
        handleDeletePaymentClick(id)
      }
    },
    [
      invoicePayment,
    ],
  )

  const onCancelReasonChange = (event) => {
    if (event.target.value !== '' || event.target.value !== undefined)
      setShowError(false)
  }

  const shouldDisableAddPayment = () => {
    if (disabled) return disabled

    const totalPaid = values.invoicePayment.reduce(
      (total, payment) =>
        !payment.isCancelled ? total + payment.totalAmtPaid : total,
      0,
    )
    return values.finalPayable <= totalPaid
  }

  const handleCancelClick = useCallback(
    (id) => {
      const index = invoicePayment.findIndex(
        (item) => parseInt(item.id, 10) === parseInt(id, 10),
      )
      setFieldValue(`invoicePayment[${index}].cancelReason`, undefined)
    },
    [
      invoicePayment,
    ],
  )

  const shouldDisablePrintInvoice = useCallback(
    () => values.invoicePayment && values.invoicePayment.length === 0,
    [
      values.invoicePayment,
    ],
  )

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
                {parseToTwoDecimalString(roundToTwoDecimals(gstAmount))}
              </h5>
            </GridItem>
            <GridItem md={6}>
              <h5>Final Bill</h5>
            </GridItem>
            <GridItem md={6} className={classes.rightAlign}>
              <h5 className={classes.currencyValue}>
                {parseToTwoDecimalString(roundToTwoDecimals(totalAftGst))}
              </h5>
            </GridItem>
            <GridItem md={6}>
              <h5 style={{ fontWeight: 500 }}>Total Claims</h5>
            </GridItem>
            <GridItem md={6} className={classes.rightAlign}>
              <h5 className={classes.currencyValue}>
                {parseToTwoDecimalString(values.finalClaim)}
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
                {parseToTwoDecimalString(values.finalPayable)}
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
              {invoicePayment.map((item, index) => {
                const titleClass = classnames({
                  [classes.crossed]: item.isCancelled,
                })
                return (
                  <React.Fragment>
                    <GridItem md={11}>
                      <h5 className={titleClass}>
                        Receipt No: {item.receiptNo || 'N/A'}
                      </h5>
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
                      <React.Fragment>
                        <GridItem md={1} />
                        <GridItem md={5}>
                          <p>{payment.paymentMode}</p>
                        </GridItem>
                        <GridItem md={6} className={classes.rightAlign}>
                          <p className={classes.currencyValue}>
                            {parseToTwoDecimalString(payment.amt)}
                          </p>
                        </GridItem>
                      </React.Fragment>
                    ))}
                  </React.Fragment>
                )
              })}
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
                // disabled={shouldDisablePrintInvoice()}
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
