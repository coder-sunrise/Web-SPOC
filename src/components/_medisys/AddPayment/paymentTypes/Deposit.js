import React from 'react'
import { connect } from 'dva'
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
import { roundToTwoDecimals, currencyFormatter } from '@/utils/utils'
import styles from '../styles'

const Deposit = ({
  classes,
  payment,
  index,
  handleDeletePayment,
  handleAmountChange,
  patientInfo,
}) => {
  const maxAmount =
    patientInfo && patientInfo.patientDeposit
      ? patientInfo.patientDeposit.balance
      : undefined
  return (
    <CardContainer hideHeader>
      <h5 className={classes.paymentItemHeader}>Deposit</h5>
      <p style={{ display: 'inline', marginLeft: 8 }}>
        Balance:&nbsp;
        <span style={{ color: 'darkblue', fontWeight: 500 }}>
          {currencyFormatter(maxAmount)}
        </span>
      </p>
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
                label='Amount'
                {...args}
                currency
                max={maxAmount}
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

// const ConnectedDeposit = connect(({ patient }) => ({
//   patient: patient.entity,
// }))(Deposit)

export default withStyles(styles, { name: 'DepositPayment' })(Deposit)
