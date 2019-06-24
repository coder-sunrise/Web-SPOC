import React, { Component } from 'react'
// material ui
import { withStyles } from '@material-ui/core'
import TrashBin from '@material-ui/icons/Delete'
// common components
import {
  Button,
  CardContainer,
  GridContainer,
  GridItem,
  NumberInput,
  TextField,
  Select,
} from '@/components'
// sub component
import PayerHeader from './PayerHeader'
import PaymentType from './PaymentType'
// styling
import styles from './styles'

class AddPayment extends Component {
  render () {
    const { classes, onClose, onConfirm } = this.props
    return (
      <div>
        <PayerHeader />
        <PaymentType />
        <GridContainer justify='space-between' alignItems='flex-end'>
          <GridItem md={12}>
            <CardContainer hideHeader>
              <h5 className={classes.paymentItemHeader}>Cash</h5>
              <Button
                justIcon
                round
                color='danger'
                size='sm'
                className={classes.trashBin}
              >
                <TrashBin />
              </Button>
              <GridContainer>
                <GridItem md={6}>
                  <NumberInput label='Amount' />
                </GridItem>
                <GridItem md={6}>
                  <TextField label='Remarks' />
                </GridItem>
              </GridContainer>
            </CardContainer>
          </GridItem>
          <GridItem md={12}>
            <CardContainer hideHeader>
              <h5 className={classes.paymentItemHeader}>Nets</h5>
              <Button
                justIcon
                round
                color='danger'
                size='sm'
                className={classes.trashBin}
              >
                <TrashBin />
              </Button>
              <GridContainer>
                <GridItem md={6}>
                  <NumberInput label='Amount' />
                </GridItem>
                <GridItem md={6}>
                  <TextField label='Remarks' />
                </GridItem>
              </GridContainer>
            </CardContainer>
          </GridItem>
          <GridItem md={12}>
            <CardContainer hideHeader>
              <h5 className={classes.paymentItemHeader}>Credit Card</h5>
              <Button
                justIcon
                round
                color='danger'
                size='sm'
                className={classes.trashBin}
              >
                <TrashBin />
              </Button>
              <GridContainer>
                <GridItem md={6}>
                  <Select
                    label='Card Type'
                    options={[
                      { name: 'Credit Card', value: 'creditCard' },
                      { name: 'Visa', value: 'visa' },
                    ]}
                  />
                </GridItem>
                <GridItem md={6}>
                  <NumberInput label='Card No.' />
                </GridItem>
              </GridContainer>
              <GridContainer>
                <GridItem md={6}>
                  <NumberInput label='Amount' />
                </GridItem>
                <GridItem md={6}>
                  <TextField label='Remarks' />
                </GridItem>
              </GridContainer>
            </CardContainer>
          </GridItem>
          <GridItem md={6} className={classes.paymentSummary}>
            <h4>Outstanding balance after payment: $0.00</h4>
          </GridItem>
          <GridItem md={6} container className={classes.paymentSummary}>
            <GridItem md={6}>Total Payment: </GridItem>
            <GridItem md={6}>$ 0.00</GridItem>

            <GridItem md={6}>Cash Rounding: </GridItem>
            <GridItem md={6}>$ 0.00</GridItem>
            <GridItem md={6}>Collectable Amount: </GridItem>
            <GridItem md={6}>$ 0.00</GridItem>
            <GridItem md={6}>Cash Received: </GridItem>
            <GridItem md={6}>$ 0.00</GridItem>
            <GridItem md={6}>Cash Returned: </GridItem>
            <GridItem md={6}>$ 0.00</GridItem>
          </GridItem>
          <GridItem md={12} className={classes.addPaymentActionButtons}>
            <Button size='sm' color='danger' onClick={onClose}>
              Cancel
            </Button>
            <Button size='sm' color='primary' onClick={onConfirm}>
              Confirm
            </Button>
          </GridItem>
        </GridContainer>
      </div>
    )
  }
}

export default withStyles(styles, { name: 'AddPayment' })(AddPayment)
