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
        {...ButtonProps}
        onClick={handleAddPayment}
        disabled={!handleAddPayment}
      >
        <Add />
        Add Payment
      </Button>
      {type !== PayerType.GOVT_COPAYER && (
        <Button
          {...ButtonProps}
          onClick={() => handleAddCrNote(type)}
          disabled={!handleAddCrNote}
        >
          <Add />
          Add Cr. Note
        </Button>
      )}
      {type === PayerType.PATIENT && (
        <Button
          {...ButtonProps}
          onClick={handleWriteOff}
          disabled={!handleWriteOff}
        >
          <Add />
          Write Off
        </Button>
      )}
      <Button
        {...ButtonProps}
        onClick={handlePrintInvoice}
        disabled={!handlePrintInvoice}
      >
        <Printer />
        Print Invoice
      </Button>
    </React.Fragment>
  )
}

export default PaymentActions
