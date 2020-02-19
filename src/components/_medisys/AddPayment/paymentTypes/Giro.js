import React from 'react'
// formik
import { FastField } from 'formik'
// material ui
import { withStyles } from '@material-ui/core'
// common component
import { GridContainer, GridItem, NumberInput, TextField } from '@/components'
import PaymentBase from './PaymentBase'
import styles from '../styles'

const Giro = ({ payment, index, handleDeletePayment, handleAmountChange }) => {
  return (
    <PaymentBase payment={payment} handleDeletePayment={handleDeletePayment}>
      <GridContainer>
        <GridItem md={6}>
          <FastField
            name={`paymentList[${index}].amt`}
            render={(args) => (
              <NumberInput
                label='Amount'
                min={0}
                {...args}
                onChange={handleAmountChange}
                currency
              />
            )}
          />
        </GridItem>
        <GridItem md={6}>
          <FastField
            name={`paymentList[${index}].giroPayment.refNo`}
            render={(args) => <TextField label='Referrence No.' {...args} />}
          />
        </GridItem>
        <GridItem md={6}>
          <FastField
            name={`paymentList[${index}].remark`}
            render={(args) => <TextField label='Remarks' {...args} />}
          />
        </GridItem>
      </GridContainer>
    </PaymentBase>
  )
}

export default withStyles(styles, { name: 'GiroPayment' })(Giro)
