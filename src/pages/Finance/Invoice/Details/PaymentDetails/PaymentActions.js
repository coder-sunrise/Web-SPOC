import React, { useState } from 'react'
// material ui
import Printer from '@material-ui/icons/Print'
import Add from '@material-ui/icons/Add'
import RepeatIcon from '@material-ui/icons/Repeat'
// common components
import { Button, Popover } from '@/components'
import { ableToViewByAuthority } from '@/utils/utils'
import { INVOICE_REPORT_TYPES } from '@/utils/constants'
import MenuItem from '@material-ui/core/MenuItem'
import MenuList from '@material-ui/core/MenuList'
// constants variables
import { PayerType } from './variables'

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
  isFromPastSession = false,
}) => {
  const [showPrintInvoiceMenu, setShowPrintInvoiceMenu] = useState(false)
  const ButtonProps = {
    icon: true,
    simple: true,
    color: 'primary',
    size: 'sm',
  }
  const isEnableAddPayment = () => {
    //can't add payment for current session invoice
    if (!isFromPastSession) return false
    if (type === PayerType.PATIENT) {
      return ableToViewByAuthority('finance.addpastsessionpatientpayment')
    }
    return ableToViewByAuthority('finance.addpastsessioncopayerpayment')
  }
  const isEnableAddCreditNote = () => {
    //can't add Credit Note for current session invoice
    if (!isFromPastSession) return false
    if (type === PayerType.PATIENT)
      return ableToViewByAuthority('finance.addpatientcreditnote')
    return ableToViewByAuthority('finance.addcopayercreditnote')
  }
  return (
    <div>
      {isEnableAddPayment() && (
        <Button
          onClick={() => handleAddPayment(invoicePayerFK)}
          disabled={!handleAddPayment || readOnly}
          {...ButtonProps}
        >
          <Add />
          Add Payment
        </Button>
      )}
      {isEnableAddCreditNote() && type !== PayerType.GOVT_COPAYER && (
        <Button
          onClick={() => handleAddCrNote(invoicePayerFK, type)}
          disabled={!handleAddCrNote || readOnly}
          {...ButtonProps}
        >
          <Add />
          Add Cr. Note
        </Button>
      )}
      {type === PayerType.PATIENT && isFromPastSession && (
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
        isFromPastSession &&
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
      {type === PayerType.COPAYER_REAL &&
        isFromPastSession &&
        ableToViewByAuthority('finance.transfercopayerbalancetopatient') && (
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
        disabled={!handlePrinterClick}
        {...ButtonProps}
        onClick={() =>
          handlePrinterClick(
            'TaxInvoice',
            undefined,
            companyFK,
            invoicePayerFK,
            companyFK
              ? INVOICE_REPORT_TYPES.DETAILEDINVOICE
              : INVOICE_REPORT_TYPES.INDIVIDUALINVOICE,
          )
        }
      >
        <Printer />
        Print Invoice
      </Button>
    </div>
  )
}

export default PaymentActions
