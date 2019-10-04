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
  handlePrintInvoice,
  type,
  invoicePayerFK,
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
        disabled={!handleAddPayment}
        {...ButtonProps}
      >
        <Add />
        Add Payment
      </Button>
      {type !== PayerType.GOVT_COPAYER && (
        <Button
          onClick={() => handleAddCrNote(type)}
          disabled={!handleAddCrNote}
          {...ButtonProps}
        >
          <Add />
          Add Cr. Note
        </Button>
      )}
      {type === PayerType.PATIENT && (
        <Button
          onClick={handleWriteOff}
          disabled={!handleWriteOff}
          {...ButtonProps}
        >
          <Add />
          Write Off
        </Button>
      )}
      <Button
        onClick={handlePrintInvoice}
        disabled={!handlePrintInvoice}
        {...ButtonProps}
      >
        <Printer />
        Print Invoice
      </Button>
    </React.Fragment>
  )
}

export default PaymentActions
