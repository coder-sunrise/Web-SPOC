import React from 'react'
// material ui
import Printer from '@material-ui/icons/Print'
import Add from '@material-ui/icons/Add'
import RepeatIcon from '@material-ui/icons/Repeat'
// common components
import { Button } from '@/components'
// constants variables
import { PayerType } from './variables'

const PaymentActions = ({
  handleAddPayment,
  handleAddCrNote,
  handleWriteOff,
  handlePrinterClick,
  handleTransferClick,
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
        disabled={!handleAddPayment || readOnly}
        {...ButtonProps}
      >
        <Add />
        Add Payment
      </Button>
      {type !== PayerType.GOVT_COPAYER && (
        <Button
          // onClick={() => handleAddCrNote(type)}
          onClick={() => handleAddCrNote(invoicePayerFK, type)}
          disabled={!handleAddCrNote || readOnly}
          {...ButtonProps}
        >
          <Add />
          Add Cr. Note
        </Button>
      )}
      {type === PayerType.PATIENT && (
        <Button
          onClick={() => handleWriteOff(invoicePayerFK)}
          disabled={!handleWriteOff || readOnly}
          {...ButtonProps}
        >
          <Add />
          Write Off
        </Button>
      )}
      {type === PayerType.COPAYER_REAL && (
        <Button
          onClick={() => handleTransferClick(invoicePayerFK, type)}
          disabled={!handleTransferClick || readOnly}
          {...ButtonProps}
        >
          <RepeatIcon />
          Transfer
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
