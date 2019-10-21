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

const Content = ({ classes, ...restProps }) => {
  const { invoiceDetail, invoicePayment } = restProps
  const { currentBizSessionInfo } = invoicePayment
  const { entity } = invoiceDetail
  const currentBizSessionFK = currentBizSessionInfo
    ? currentBizSessionInfo.id
    : undefined
  const invoiceBizSessionFK = entity ? entity.bizSessionFK : undefined

  const [
    active,
    setActive,
  ] = useState('1')

  const isInvoiceCurrentBizSession = () => {
    if (currentBizSessionFK && invoiceBizSessionFK) {
      if (currentBizSessionFK === invoiceBizSessionFK) {
        return true
      }
      return false
    }

    return false
  }

  const addContent = (type) => {
    switch (type) {
      case 1:
        return <InvoiceDetails {...restProps} />
      case 2:
        return (
          <PaymentDetails
            invoiceDetail={restProps.values}
            readOnly={!currentBizSessionFK}
          />
        )
      default:
        return <InvoiceDetails {...restProps} />
    }
  }

  const InvoicePaymentTabOption = () => [
    {
      id: 1,
      name: 'Invoice',
      content: addContent(1),
    },
    {
      id: 2,
      name: 'Payment Details',
      content: addContent(2),
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
        options={InvoicePaymentTabOption()}
      />
    </React.Fragment>
  )
}

export default withStyles(styles, { name: 'InvoiceNavPills' })(Content)
