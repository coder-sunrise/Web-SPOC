import React from 'react'
// material ui
import { IconButton, withStyles } from '@material-ui/core'
import Printer from '@material-ui/icons/Print'
// common components
import { CardContainer, GridContainer, GridItem } from '@/components'
// sub component
import PaymentRow from './PaymentRow'
import PaymentActions from './PaymentActions'
import PaymentSummary from './PaymentSummary'
// styles
import styles from './styles'
import { PayerType } from './variables'

const DefaultPaymentInfo = {
  type: 'Payment',
  itemID: 'N/A',
  date: 'N/A',
  amount: 'N/A',
}

const payerTypeToString = {
  [PayerType.PATIENT]: 'Patient',
  [PayerType.COPAYER]: 'Co-Payer',
  [PayerType.GOVT_COPAYER]: 'Co-Payer',
}

const PaymentCard = ({
  classes,
  payerID = 'N/A',
  payerName = 'N/A',
  payerType = PayerType.PATIENT,
  payments = [
    { ...DefaultPaymentInfo },
    { ...DefaultPaymentInfo },
  ],
}) => {
  return (
    <CardContainer hideHeader>
      <p className={classes.title}>
        {`${payerTypeToString[payerType]} (${payerName})`}
      </p>
      <CardContainer hideHeader size='sm'>
        <IconButton id={payerID} className={classes.printButton}>
          <Printer />
        </IconButton>
        {payments.map((payment) => <PaymentRow {...payment} />)}
      </CardContainer>
      <GridContainer alignItems='center'>
        <GridItem md={7}>
          <PaymentActions type={payerType} />
        </GridItem>
        <GridItem
          md={5}
          container
          direction='column'
          justify='center'
          alignItems='flex-end'
        >
          <PaymentSummary />
        </GridItem>
        <GridItem />
      </GridContainer>
    </CardContainer>
  )
}

export default withStyles(styles, { name: 'InvoicePaymentCard' })(PaymentCard)
