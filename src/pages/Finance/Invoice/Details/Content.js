import React, { useState } from 'react'
import classnames from 'classnames'
// material ui
import { withStyles } from '@material-ui/core/styles'
import Printer from '@material-ui/icons/Print'
// common components
import { Button, CommonModal, Tabs } from '@/components'
import { ReportViewer } from '@/components/_medisys'
// sub components
import InvoiceDetails from './InvoiceDetails'
import PaymentDetails from './PaymentDetails'
// styling
import styles from './styles'

const Content = ({ classes, clinicSettings, values, ...restProps }) => {
  const { invoiceDetail, invoicePayment } = restProps
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
      content: <InvoiceDetails values={values} />,
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

  return (
    <React.Fragment>
      <Tabs
        style={{ marginTop: 20 }}
        activeKey={active}
        defaultActivekey='1'
        onChange={(e) => setActive(e)}
        options={InvoicePaymentTabOption}
      />
    </React.Fragment>
  )
}

export default withStyles(styles, { name: 'InvoiceNavPills' })(Content)
