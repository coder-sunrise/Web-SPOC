import React from 'react'
// material ui
import Printer from '@material-ui/icons/Print'
import Add from '@material-ui/icons/Add'
// common components
import { Button } from '@/components'
// constants variables
import { PayerType } from './variables'

const PaymentActions = ({
  handleAddPayment,
  handleAddCrNote,
  handleWriteOff,
  handlePrinterClick,
  type,
  invoicePayerFK,
  companyFK,
  readOnly,
  hasActiveSession,
}) => {
  const ButtonProps = {
    icon: true,
    simple: true,
    color: 'primary',
    size: 'sm',
  }

  return (
    <React.Fragment>
      <Button
        onClick={() => handleAddPayment(invoicePayerFK)}
        disabled={
          hasActiveSession ? !handleAddPayment || readOnly : !hasActiveSession
        }
        {...ButtonProps}
      >
        <Add />
        Add Payment
      </Button>
      {type !== PayerType.GOVT_COPAYER && (
        <Button
          // onClick={() => handleAddCrNote(type)}
          onClick={() => handleAddCrNote(invoicePayerFK)}
          disabled={
            hasActiveSession ? !handleAddCrNote || readOnly : !hasActiveSession
          }
          {...ButtonProps}
        >
          <Add />
          Add Cr. Note
        </Button>
      )}
      {type === PayerType.PATIENT && (
        <Button
          onClick={() => handleWriteOff(invoicePayerFK)}
          disabled={
            hasActiveSession ? !handleAddCrNote || readOnly : !hasActiveSession
          }
          {...ButtonProps}
        >
          <Add />
          Write Off
        </Button>
      )}
      <Button
        onClick={() => handlePrinterClick('TaxInvoice', undefined, companyFK)}
        disabled={!handlePrinterClick}
        {...ButtonProps}
      >
        <Printer />
        Print Invoice
      </Button>
    </React.Fragment>
  )
}

export default PaymentActions
