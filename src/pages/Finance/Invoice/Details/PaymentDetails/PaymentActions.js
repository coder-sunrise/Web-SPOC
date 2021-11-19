import React from 'react'
// material ui
import Printer from '@material-ui/icons/Print'
import Add from '@material-ui/icons/Add'
import RepeatIcon from '@material-ui/icons/Repeat'
// common components
import { Button } from '@/components'
// constants variables
import { PayerType } from './variables'
import { ableToViewByAuthority } from '@/utils/utils'

const PaymentActions = ({
  handleAddPayment,
  handleAddCrNote,
  handleWriteOff,
  handleTransferToDeposit,
  handlePrinterClick,
  handleTransferClick,
  type,
  invoicePayerFK,
  companyFK,
  readOnly,
  isEnableWriteOffinInvoice,
}) => {
  const ButtonProps = {
    icon: true,
    simple: true,
    color: 'primary',
    size: 'sm',
  }
  return (
    <div>
      <Button
        onClick={() => handleAddPayment(invoicePayerFK)}
        disabled={!handleAddPayment || readOnly}
        {...ButtonProps}
      >
        <Add />
        Add Payment
      </Button>
      {ableToViewByAuthority('finance.addcreditnote') &&
        type !== PayerType.GOVT_COPAYER && (
          <Button
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
          onClick={() => handleTransferToDeposit(invoicePayerFK)}
          disabled={!handleTransferToDeposit || readOnly}
          {...ButtonProps}
        >
          <Add />
          Transfer Deposit
        </Button>
      )}
      {isEnableWriteOffinInvoice &&
        ableToViewByAuthority('finance.createwriteoff') &&
        type === PayerType.PATIENT && (
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
        onClick={() =>
          handlePrinterClick('TaxInvoice', undefined, companyFK, invoicePayerFK)
        }
        disabled={!handlePrinterClick}
        {...ButtonProps}
      >
        <Printer />
        Print Invoice
      </Button>
    </div>
  )
}

export default PaymentActions
