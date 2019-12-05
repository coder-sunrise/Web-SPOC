import React, { useState, useCallback } from 'react'
import numeral from 'numeral'
// material ui
import { withStyles } from '@material-ui/core'
// ant design
import { Divider } from 'antd'
// common components
import { Button, CardContainer, GridContainer, GridItem } from '@/components'
import Payments from './Payments'
// utils
import { roundTo } from '@/utils/utils'
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
  handlePrintReceiptClick,
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
  const {
    gstValue,
    gstAmount,
    totalAftGst,
    invoiceNo,
    isGstInclusive,
  } = invoice
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

  return (
    <React.Fragment>
      <GridItem md={12}>
        <h4 style={{ textAlign: 'center' }}>Invoice Summary: {invoiceNo}</h4>
      </GridItem>
      <GridItem md={10}>
        <CardContainer hideHeader>
          <GridContainer justify='space-between'>
            {gstValue && (
              <React.Fragment>
                <GridItem md={6}>
                  <h5>
                    {roundTo(gstValue).toFixed(2)}% GST{isGstInclusive ? ' inclusive' : ''}
                  </h5>
                </GridItem>
                <GridItem md={6} className={classes.rightAlign}>
                  <h5 className={classes.currencyValue}>
                    {parseToTwoDecimalString(roundTo(gstAmount))}
                  </h5>
                </GridItem>
              </React.Fragment>
            )}
            <GridItem md={6}>
              <h5>Final Bill</h5>
            </GridItem>
            <GridItem md={6} className={classes.rightAlign}>
              <h5 className={classes.currencyValue}>
                {parseToTwoDecimalString(roundTo(totalAftGst))}
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
              <Payments
                invoicePayment={invoicePayment}
                onCancelReasonChange={onCancelReasonChange}
                showError={showError}
                errorMessage={errorMessage}
                handleCancelClick={handleCancelClick}
                handleConfirmDelete={handleConfirmDelete}
                handlePrintReceiptClick={handlePrintReceiptClick}
              />
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
