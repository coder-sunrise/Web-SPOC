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
  TextField,
  Tooltip,
} from '@/components'
import styles from '../styles'

const Cash = ({
  classes,
  payment,
  index,
  handleDeletePayment,
  handleAmountChange,
}) => {
  return (
    <CardContainer hideHeader>
      <h5 className={classes.paymentItemHeader}>Cash</h5>
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
            name={`paymentList[${index}].amt`}
            render={(args) => (
              <NumberInput
                autoFocus
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
    </CardContainer>
  )
}

export default withStyles(styles, { name: 'CashPayment' })(Cash)
