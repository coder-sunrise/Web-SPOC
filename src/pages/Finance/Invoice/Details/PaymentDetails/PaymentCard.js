import React from 'react'
import moment from 'moment'
// material ui
import { withStyles } from '@material-ui/core'
// common components
import {
  CodeSelect,
  CardContainer,
  GridContainer,
  GridItem,
} from '@/components'
// sub component
import PaymentRow from './PaymentRow'
import PaymentActions from './PaymentActions'
import PaymentSummary from './PaymentSummary'
// styles
import styles from './styles'
import { PayerType } from './variables'
import { INVOICE_PAYER_TYPE } from '@/utils/constants'

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
  // [PayerType.PATIENT]: 'Patient',
  // [PayerType.COPAYER]: 'Co-Payer',
  [INVOICE_PAYER_TYPE.PATIENT]: 'Patient',
  [INVOICE_PAYER_TYPE.SCHEME]: 'Co-Payer',
  [INVOICE_PAYER_TYPE.COMPANY]: 'Co-Payer',
  // [PayerType.GOVT_COPAYER]: 'Co-Payer',
}

const PaymentCard = ({
  classes,
  // payerID = 'N/A',
  // payerName = 'N/A',
  coPaymentSchemeFK = undefined,
  companyFK = undefined,
  companyName = '',
  patientName = 'N/A',
  payerType = '',
  payerTypeFK = PayerType.PATIENT,
  payments = [],
  totalPaid,
  outstanding,
  invoicePayerFK,
  readOnly,
  hasActiveSession,
  actions: { handleVoidClick, handlePrinterClick, ...buttonActions },
}) => {
  let _payerName = (
    <p className={classes.title}>
      {payerTypeToString[payerTypeFK]} ({patientName})
    </p>
  )
  if (payerTypeFK === INVOICE_PAYER_TYPE.SCHEME) {
    // _payerName = (
    //   <p className={classes.title}>
    //     {payerTypeToString[payerTypeFK]} ({payerType})
    //   </p>
    // )
    _payerName = (
      <p className={classes.title}>
        <span>{payerTypeToString[payerTypeFK]}&nbsp;</span>
        (<CodeSelect
          text
          code='copaymentscheme'
          valueField='id'
          value={coPaymentSchemeFK}
        />)
      </p>
    )
  }
  if (payerTypeFK === INVOICE_PAYER_TYPE.COMPANY) {
    _payerName = (
      <p className={classes.title}>
        {payerTypeToString[payerTypeFK]} ({companyName})
      </p>
    )
  }

  return (
    <CardContainer hideHeader>
      {/* <p className={classes.title}>
        {payerTypeToString[payerTypeFK]} (
        {payerTypeFK !== 1 ? (
          <CodeSelect
            className={classes.title}
            text
            code='LTInvoicePayerType'
            value={payerTypeFK}
          />
        ) : (
          patientName
        )})
      </p> */}
      {_payerName}

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
              <PaymentRow
                {...payment}
                handleVoidClick={handleVoidClick}
                handlePrinterClick={handlePrinterClick}
                readOnly={readOnly}
              />
            ))
        ) : (
          ''
        )}
      </CardContainer>
      <GridContainer alignItems='center'>
        <GridItem md={7}>
          <PaymentActions
            type={payerTypeFK}
            invoicePayerFK={invoicePayerFK}
            companyFK={companyFK}
            readOnly={readOnly}
            hasActiveSession={hasActiveSession}
            handlePrinterClick={handlePrinterClick}
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
