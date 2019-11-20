import React from 'react'
// material ui
import { withStyles } from '@material-ui/core'
// common components
import { CardContainer } from '@/components'
import PaymentTypeRow from './PaymentTypeRow'
// styling
import styles from './styles'

const PayerHeader = ({
  classes,
  paymentModes,
  disableCash,
  hideDeposit,
  handlePaymentTypeClick,
  patientInfo,
}) => {
  return (
    <CardContainer className={classes.paymentModeContainer} hideHeader>
      {paymentModes.map((mode) => (
        <PaymentTypeRow
          mode={mode}
          hideDeposit={hideDeposit}
          patientInfo={patientInfo}
          disableCash={disableCash}
          onPaymentModeClick={handlePaymentTypeClick}
        />
      ))}
    </CardContainer>
    // <GridContainer alignItems='flex-start' className={classes.paymentTypeRow}>
    //   <GridItem md={12}>

    //   </GridItem>
    //    <GridItem>
    //     <Button
    //       color='primary'
    //       size='sm'
    //       disabled={disableCash}
    //       id={PAYMENT_MODE.CASH}
    //       onClick={handlePaymentTypeClick}
    //     >
    //       <Add />
    //       Cash
    //     </Button>
    //     <Button
    //       color='primary'
    //       size='sm'
    //       id={PAYMENT_MODE.NETS}
    //       onClick={handlePaymentTypeClick}
    //     >
    //       <Add />
    //       Nets
    //     </Button>
    //     <Button
    //       color='primary'
    //       size='sm'
    //       id={PAYMENT_MODE.CREDIT_CARD}
    //       onClick={handlePaymentTypeClick}
    //     >
    //       <Add />
    //       Credit Card
    //     </Button>
    //     <Button
    //       color='primary'
    //       size='sm'
    //       id={PAYMENT_MODE.CHEQUE}
    //       onClick={handlePaymentTypeClick}
    //     >
    //       <Add />
    //       Cheque
    //     </Button>
    //     <Button
    //       color='primary'
    //       size='sm'
    //       id={PAYMENT_MODE.GIRO}
    //       onClick={handlePaymentTypeClick}
    //     >
    //       <Add />
    //       GIRO
    //     </Button>
    //     {!hideDeposit && (
    //       <Button
    //         color='primary'
    //         size='sm'
    //         id={PAYMENT_MODE.DEPOSIT}
    //         onClick={handlePaymentTypeClick}
    //         disabled={patientInfo.patientDeposit === undefined}
    //       >
    //         <Add />
    //         Deposit
    //       </Button>
    //     )}
    //   </GridItem>
    // </GridContainer>
  )
}

export default withStyles(styles, { name: 'PayerHeader' })(PayerHeader)
