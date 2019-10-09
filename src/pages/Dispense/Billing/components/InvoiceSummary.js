import React from 'react'
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
} from '@/components'

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
})

const InvoiceSummary = ({ classes, handleAddPaymentClick, values }) => {
  const { invoicePaymentModes = [] } = values
  return (
    <React.Fragment>
      <GridItem md={12}>
        <h4 style={{ textAlign: 'center' }}>Invoice Summary: IVC0000111</h4>
      </GridItem>
      <GridItem md={10}>
        <CardContainer hideHeader>
          <GridContainer justify='space-between'>
            <GridItem md={6}>
              <h5>GST ({values.gstAmount}%)</h5>
            </GridItem>
            <GridItem md={6} className={classes.rightAlign}>
              <h5>${values.gstValue === 0 ? values.gstValue * 100 : 0}</h5>
            </GridItem>
            <GridItem md={6}>
              <h5>Final Bill</h5>
            </GridItem>
            <GridItem md={6} className={classes.rightAlign}>
              <h5>{values.totalAftGst}</h5>
            </GridItem>
            <GridItem md={6}>
              <h5 style={{ fontWeight: 500 }}>Total Claims</h5>
            </GridItem>
            <GridItem md={6} className={classes.rightAlign}>
              <h5>$</h5>
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
              <h5>$</h5>
            </GridItem>
          </GridContainer>
        </CardContainer>
      </GridItem>
      <GridItem md={10}>
        <CardContainer hideHeader>
          <h4 style={{ fontWeight: 500 }}>Payment</h4>
          <GridContainer justify='space-between'>
            {invoicePaymentModes.length > 0 &&
              invoicePaymentModes.map((item) => (
                <GridContainer>
                  <GridItem md={6}>
                    <h5>{item.paymentMode}</h5>
                  </GridItem>
                  <GridItem md={6} className={classes.rightAlign}>
                    <h5>${item.amt}</h5>
                  </GridItem>
                </GridContainer>
              ))}
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
                disabled
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
