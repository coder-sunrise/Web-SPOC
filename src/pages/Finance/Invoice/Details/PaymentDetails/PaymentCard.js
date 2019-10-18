import React from 'react'
import _ from 'lodash'
import moment from 'moment'
// material ui
import { IconButton, withStyles } from '@material-ui/core'
import Printer from '@material-ui/icons/Print'
// common components
import {
  CardContainer,
  GridContainer,
  GridItem,
  CodeSelect,
} from '@/components'
// sub component
import PaymentRow from './PaymentRow'
import PaymentActions from './PaymentActions'
import PaymentSummary from './PaymentSummary'
// styles
import styles from './styles'
import { PayerType } from './variables'

const DefaultPaymentInfo = {
  id: 0,
  type: 'Payment',
  itemID: 'N/A',
  date: 'N/A',
  amount: 'N/A',
  reason: 'N/A',
  isCancelled: false,
}

const payerTypeToString = {
  [PayerType.PATIENT]: 'Patient',
  [PayerType.COPAYER]: 'Co-Payer',
  // [PayerType.GOVT_COPAYER]: 'Co-Payer',
}

const PaymentCard = ({
  classes,
  // payerID = 'N/A',
  // payerName = 'N/A',
  patientName = 'N/A',
  payerType = PayerType.PATIENT,
  payments = [],
  totalPaid,
  outstanding,
  invoicePayerFK,
  readOnly,
  actions: { handleVoidClick, handlePrinterClick, ...buttonActions },
}) => {
  return (
    <CardContainer hideHeader>
      <p className={classes.title}>
        {payerTypeToString[payerType]} (
        {payerType !== 1 ? (
          <CodeSelect
            className={classes.title}
            text
            code='LTInvoicePayerType'
            value={payerType}
          />
        ) : (
          patientName
        )})
      </p>

      <CardContainer hideHeader size='sm'>
        {/* <IconButton
          id={payerID}
          className={classes.printButton}
          onClick={handlePrinterClick}
        >
          <Printer />
        </IconButton> */}

        {/* {payments.map((payment) => (
          <PaymentRow {...payment} handleVoidClick={handleVoidClick} />
        ))} */}

        {payments ? (
          payments
            .sort((a, b) => moment(a.date) - moment(b.date))
            .map((payment) => (
              <PaymentRow {...payment} handleVoidClick={handleVoidClick} readOnly={readOnly} />
            ))
        ) : (
          ''
        )}
      </CardContainer>
      <GridContainer alignItems='center'>
        <GridItem md={7}>
          <PaymentActions
            type={payerType}
            invoicePayerFK={invoicePayerFK}
            readOnly={readOnly}
            {...buttonActions}
          />
        </GridItem>
        <GridItem
          md={5}
          container
          direction='column'
          justify='center'
          alignItems='flex-end'
        >
          <PaymentSummary totalPaid={totalPaid} outstanding={outstanding} />
        </GridItem>
        <GridItem />
      </GridContainer>
    </CardContainer>
  )
}

export default withStyles(styles, { name: 'InvoicePaymentCard' })(PaymentCard)
