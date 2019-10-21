import React from 'react'
// material ui
import { withStyles } from '@material-ui/core'
// ant design
import { Divider } from 'antd'
// common components
import { Button, CardContainer, GridContainer, GridItem } from '@/components'
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
  disabled,
  values,
}) => {
  const { payments, invoice } = values
  const { gstValue, gstAmount, totalAftGst, invoiceNo } = invoice
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
                GST ({parseToTwoDecimalString(
                  roundToTwoDecimals(gstValue * 100),
                )}%)
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
              {payments.map((item) =>
                item.paymentModes.map((payment) => (
                  <React.Fragment>
                    <GridItem md={6}>
                      <h5>{payment.paymentMode}</h5>
                    </GridItem>
                    <GridItem md={6} className={classes.rightAlign}>
                      <h5 className={classes.currencyValue}>
                        $ {parseToTwoDecimalString(payment.amt)}
                      </h5>
                    </GridItem>
                  </React.Fragment>
                )),
              )}
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
                disabled={disabled}
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
