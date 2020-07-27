import React, { useState } from 'react'
import classnames from 'classnames'
// material ui
import { withStyles } from '@material-ui/core/styles'
import Printer from '@material-ui/icons/Print'
// common components
import { Button, CommonModal, Tabs } from '@/components'
import { ReportViewer } from '@/components/_medisys'
// utils
import { INVOICE_VIEW_MODE } from '@/utils/constants'
// sub components
import InvoiceDetails from './InvoiceDetails'
import PaymentDetails from './PaymentDetails'
import AppliedSchemes from './AppliedSchemes'
// styling
import styles from './styles'
 
const Content = ({ classes, clinicSettings, values, ...restProps }) => {
  const { invoiceDetail, invoicePayment, dispatch } = restProps
  const { currentBizSessionInfo } = invoicePayment
  const { entity } = invoiceDetail
  const invoiceBizSessionFK = entity ? entity.bizSessionFK : undefined

  const [
    active,
    setActive,
  ] = useState('1')

  const isInvoiceCurrentBizSession = () => {
    const { id: bizSessionFK } = currentBizSessionInfo

    // no active session, return false, all the other buttons will be read only
    if (bizSessionFK === '') return false

    if (bizSessionFK && invoiceBizSessionFK) {
      // temperary enhancement for Bless Xray only
      if (clinicSettings.enablePaymentInFinanceWithoutSessionClose) {
        return false
      }
      const isSameBizSessionAndIsSessionClosed =
        parseInt(bizSessionFK, 10) === parseInt(invoiceBizSessionFK, 10) &&
        !currentBizSessionInfo.isClinicSessionClosed

      return isSameBizSessionAndIsSessionClosed
    }

    return false
  }

  const InvoicePaymentTabOption = [
    {
      id: 1,
      name: 'Invoice',
      content: <InvoiceDetails values={values} dispatch={dispatch} />,
    },
    {
      id: 2,
      name: 'Payment Details',
      content: (
        <PaymentDetails
          invoiceDetail={values}
          readOnly={!currentBizSessionInfo.id}
        />
      ),
      disabled: isInvoiceCurrentBizSession(),
    },
  ]

  const switchMode = () => {
    dispatch({
      type: 'invoiceDetail/updateState',
      payload: {
        mode: INVOICE_VIEW_MODE.APPLIED_SCHEME,
      },
    })
  }

  return (
    <React.Fragment>
      {invoiceDetail.mode === INVOICE_VIEW_MODE.DEFAULT && (
        <div className={classes.container}>
          <Tabs
            style={{ marginTop: 20 }}
            activeKey={active}
            defaultActivekey='1'
            onChange={(e) => setActive(e)}
            options={InvoicePaymentTabOption}
          />
          <Button
            className={classes.applySchemeButton}
            color='primary'
            onClick={switchMode}
            disabled={isInvoiceCurrentBizSession()}
          >
            Apply Scheme
          </Button>
        </div>
      )}
      {invoiceDetail.mode === INVOICE_VIEW_MODE.APPLIED_SCHEME && (
        <AppliedSchemes />
      )}
    </React.Fragment>
  )
}

export default withStyles(styles, { name: 'InvoiceNavPills' })(Content)
