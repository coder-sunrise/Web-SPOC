import React from 'react'
// formik
import { FastField } from 'formik'
// material ui
import { withStyles } from '@material-ui/core'
// common component
import {
  CodeSelect,
  GridContainer,
  GridItem,
  NumberInput,
  TextField,
} from '@/components'
import PaymentBase from './PaymentBase'
import styles from '../styles'
import { CREDIT_CARD_TYPE } from '@/utils/constants'

const CreditCard = ({
  payment,
  index,
  handleAmountChange,
  handleDeletePayment,
  setFieldValue,
}) => {
  return (
    <PaymentBase payment={payment} handleDeletePayment={handleDeletePayment}>
      <GridContainer>
        <GridItem md={6}>
          <FastField
            name={`paymentList[${index}].creditCardPayment.creditCardTypeFK`}
            render={(args) => (
              <CodeSelect
                {...args}
                label='Card Type'
                code='ctcreditcardtype'
                onChange={(value) => {
                  setFieldValue(
                    `paymentList[${index}].creditCardPayment.creditCardType`,
                    CREDIT_CARD_TYPE[value],
                  )
                }}
              />
            )}
          />
        </GridItem>
        <GridItem md={6}>
          <FastField
            name={`paymentList[${index}].creditCardPayment.creditCardNo`}
            render={(args) => (
              <NumberInput
                max={9999}
                inputProps={{ maxLength: 4 }}
                maxLength={4}
                label='Card No.'
                {...args}
              />
            )}
          />
        </GridItem>
      </GridContainer>
      <GridContainer>
        <GridItem md={6}>
          <FastField
            name={`paymentList[${index}].amt`}
            render={(args) => (
              <NumberInput
                label='Amount'
                {...args}
                min={0}
                precision={0}
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

export default withStyles(styles, { name: 'CreditCardPayment' })(CreditCard)
