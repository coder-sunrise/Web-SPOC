import React from 'react'
// formik
import { FastField } from 'formik'
// material ui
import { withStyles, IconButton } from '@material-ui/core'
import TrashBin from '@material-ui/icons/Delete'
// common component
import {
  CardContainer,
  GridContainer,
  GridItem,
  NumberInput,
  Select,
  TextField,
  Tooltip,
} from '@/components'
import styles from '../styles'

const CreditCard = ({ classes, payment, handleDeletePayment }) => {
  return (
    <CardContainer hideHeader>
      <h5 className={classes.paymentItemHeader}>Credit Card</h5>
      <Tooltip title='Delete payment' placement='top-end'>
        <IconButton
          className={classes.trashBin}
          id={payment.id}
          onClick={handleDeletePayment}
        >
          <TrashBin />
        </IconButton>
      </Tooltip>
      <GridContainer>
        <GridItem md={6}>
          <FastField
            name={`${payment.id}.cardType`}
            render={(args) => (
              <Select
                {...args}
                label='Card Type'
                options={[
                  { name: 'Credit Card', value: 'creditCard' },
                  { name: 'Visa', value: 'visa' },
                ]}
              />
            )}
          />
        </GridItem>
        <GridItem md={6}>
          <FastField
            name={`${payment.id}.cardNo`}
            render={(args) => <TextField label='Card No.' {...args} />}
          />
        </GridItem>
      </GridContainer>
      <GridContainer>
        <GridItem md={6}>
          <FastField
            name={`${payment.id}.amount`}
            render={(args) => <NumberInput label='Amount' {...args} currency />}
          />
        </GridItem>
        <GridItem md={6}>
          <FastField
            name={`${payment.id}.remarks`}
            render={(args) => <TextField label='Remarks' {...args} />}
          />
        </GridItem>
      </GridContainer>
    </CardContainer>
  )
}

export default withStyles(styles, { name: 'CreditCardPayment' })(CreditCard)
