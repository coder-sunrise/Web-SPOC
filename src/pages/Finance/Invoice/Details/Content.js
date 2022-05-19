import React, { useState } from 'react'
// material ui
import { withStyles } from '@material-ui/core/styles'
// common components
import { Button, Tabs } from '@/components'
// utils
import { INVOICE_VIEW_MODE } from '@/utils/constants'
import Authorized from '@/utils/Authorized'
import AuthorizedContext from '@/components/Context/Authorized'
// sub components
import InvoiceDetails from './InvoiceDetails'
import PaymentDetails from './PaymentDetails'
import AppliedSchemes from './AppliedSchemes'
import EditInvoice from './EditInvoice'
// styling
import styles from './styles'

const Content = ({
  classes,
  clinicSettings,
  values,
  history,
  ...restProps
}) => {
  const {
    invoiceDetail,
    invoicePayment,
    dispatch,
    patient: { entity: patientProfile },
  } = restProps
  const { currentBizSessionInfo } = invoicePayment
  const { entity } = invoiceDetail
  const invoiceBizSessionFK = entity ? entity.bizSessionFK : undefined
  const patientIsActive = patientProfile && patientProfile.isActive

  const { settings = [] } = clinicSettings
  const {
    isEnableVisitationInvoiceReport = false,
    isEditInvoiceBillingEnable = false,
  } = settings

  const [active, setActive] = useState('1')

  const isInvoiceCurrentBizSession = () => {
    const { id: bizSessionFK } = currentBizSessionInfo

    // no active session, return false, all the other buttons will be read only
    if (bizSessionFK === '') return false

    if (bizSessionFK && invoiceBizSessionFK) {
      const isSameBizSessionAndIsSessionClosed =
        parseInt(bizSessionFK, 10) === parseInt(invoiceBizSessionFK, 10) &&
        !currentBizSessionInfo.isClinicSessionClosed

      return isSameBizSessionAndIsSessionClosed
    }

    return false
  }

  const disableEditInvoice = () => {
    // if not active session, can't edit invoice
    if (
      currentBizSessionInfo.id === '' ||
      currentBizSessionInfo.isClinicSessionClosed
    )
      return true

    // if current invoice not close session, can't edit invoice
    if (
      currentBizSessionInfo.id &&
      invoiceBizSessionFK &&
      parseInt(currentBizSessionInfo.id, 10) ===
        parseInt(invoiceBizSessionFK, 10)
    ) {
      return true
    }

    // if patient is inactive, can't edit invoice
    if (!patientIsActive) return true

    // if there are some credit notes, write off or invoice claim(Approved/Submitted), can't edit invoice
    if (
      (invoicePayment.entity || []).find(
        item =>
          item.creditNote.find(cn => !cn.isCancelled) ||
          item.invoicePayerWriteOff.find(w => !w.isCancelled) ||
          item.invoiceClaim.find(
            ic =>
              !ic.isCancelled &&
              (ic.status === 'Approved' || ic.status === 'Submitted'),
          ),
      )
    )
      return true

    // If there are package items, can't edit invoice
    if (entity && entity.invoiceItem) {
      const packageItems = entity.invoiceItem.filter(i => i.isPackage)
      if (packageItems.length > 0) return true
    }

    return false
  }

  const InvoicePaymentTabOption = [
    {
      id: 1,
      name: 'Invoice',
      content: (
        <InvoiceDetails
          values={values}
          dispatch={dispatch}
          isEnableVisitationInvoiceReport={isEnableVisitationInvoiceReport}
        />
      ),
    },
    {
      id: 2,
      name: 'Payment Details',
      content: (
        <PaymentDetails
          invoiceDetail={values}
          readOnly={!currentBizSessionInfo.id}
          patientIsActive={patientIsActive}
        />
      ),
      disabled: isInvoiceCurrentBizSession(),
    },
  ]

  const switchMode = mode => {
    dispatch({
      type: 'invoiceDetail/updateState',
      payload: {
        mode,
      },
    })
  }

  const checkEditInvoiceAccessRight = () => {
    const editInvoiceRight = Authorized.check('finance.editinvoice')

    if (!editInvoiceRight || editInvoiceRight.rights !== 'enable') {
      return editInvoiceRight ? editInvoiceRight.rights : 'hidden'
    }

    const editInvoiceWithPaymentRight = Authorized.check(
      'finance.editinvoice.editinvoicewithpayment',
    )
    if (
      (!editInvoiceWithPaymentRight ||
        editInvoiceWithPaymentRight.rights !== 'enable') &&
      (invoicePayment.entity || []).find(item =>
        item.invoicePayment.find(payment => !payment.isCancelled),
      )
    )
      return editInvoiceWithPaymentRight
        ? editInvoiceWithPaymentRight.rights
        : 'hidden'
    return 'enable'
  }
  return (
    <React.Fragment>
      {invoiceDetail.mode === INVOICE_VIEW_MODE.DEFAULT && (
        <div className={classes.container}>
          <Tabs
            style={{ marginTop: 20 }}
            activeKey={active}
            defaultActivekey='1'
            onChange={e => setActive(e)}
            options={InvoicePaymentTabOption}
          />
          {isEditInvoiceBillingEnable && (
            <AuthorizedContext.Provider
              value={{
                rights: checkEditInvoiceAccessRight(),
              }}
            >
              <Button
                className={classes.editInvoiceButton}
                color='primary'
                onClick={() => {
                  switchMode(INVOICE_VIEW_MODE.Edit_Invoice)
                }}
                disabled={disableEditInvoice()}
              >
                Edit Invoice
              </Button>
            </AuthorizedContext.Provider>
          )}

          {isEditInvoiceBillingEnable && (
            <Button
              className={classes.applySchemeButton}
              color='primary'
              onClick={() => {
                switchMode(INVOICE_VIEW_MODE.APPLIED_SCHEME)
              }}
              disabled={isInvoiceCurrentBizSession() || !patientIsActive}
            >
              Apply Scheme
            </Button>
          )}
        </div>
      )}
      {invoiceDetail.mode === INVOICE_VIEW_MODE.APPLIED_SCHEME && (
        <AppliedSchemes />
      )}
      {invoiceDetail.mode === INVOICE_VIEW_MODE.Edit_Invoice && (
        <EditInvoice history={history} />
      )}
    </React.Fragment>
  )
}

export default withStyles(styles, { name: 'InvoiceNavPills' })(Content)
