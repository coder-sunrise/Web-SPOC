import React from 'react'
// formik
import { FastField } from 'formik'
// common component
import { GridContainer, GridItem, NumberInput, TextField } from '@/components'
import PaymentBase from './PaymentBase'

const Cash = ({ payment, index, handleDeletePayment, handleAmountChange }) => {
  return (
    <PaymentBase payment={payment} handleDeletePayment={handleDeletePayment}>
      <GridContainer>
        <GridItem md={6}>
          <FastField
            name={`paymentList[${index}].amt`}
            render={(args) => (
              <NumberInput
                label='Amount'
                {...args}
                currency
                onChange={handleAmountChange}
              />
            )}
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

export default Cash
