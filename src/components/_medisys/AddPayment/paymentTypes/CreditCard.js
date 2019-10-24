import React from 'react'
// formik
import { FastField } from 'formik'
// material ui
import { withStyles, IconButton } from '@material-ui/core'
import TrashBin from '@material-ui/icons/Delete'
// common component
import {
  CodeSelect,
  CardContainer,
  GridContainer,
  GridItem,
  NumberInput,
  TextField,
  Tooltip,
} from '@/components'
import styles from '../styles'
import { CREDIT_CARD_TYPE } from '@/utils/constants'

const CreditCard = ({
  classes,
  payment,
  index,
  handleAmountChange,
  handleDeletePayment,
  setFieldValue,
}) => {
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
            name={`paymentList[${index}].creditCardTypeFK`}
            render={(args) => (
              <CodeSelect
                {...args}
                label='Card Type'
                code='ctcreditcardtype'
                onChange={(value) => {
                  setFieldValue(
                    `paymentList[${index}].creditCardType`,
                    CREDIT_CARD_TYPE[value],
                  )
                }}
              />
            )}
          />
        </GridItem>
        <GridItem md={6}>
          <FastField
            name={`paymentList[${index}].creditCardNo`}
            render={(args) => (
              <NumberInput
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
                currency
                onChange={handleAmountChange}
              />
            )}
          />
        </GridItem>
        <GridItem md={6}>
          <FastField
            name={`paymentList[${index}].remarks`}
            render={(args) => <TextField label='Remarks' {...args} />}
          />
        </GridItem>
      </GridContainer>
    </CardContainer>
  )
}

export default withStyles(styles, { name: 'CreditCardPayment' })(CreditCard)
