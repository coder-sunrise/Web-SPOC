import React, { useState } from 'react'
import classnames from 'classnames'
// material ui
import { withStyles } from '@material-ui/core/styles'
import Printer from '@material-ui/icons/Print'
// common components
import { Button, Tabs } from '@/components'
// sub components
import InvoiceDetails from './InvoiceDetails'
import PaymentDetails from './PaymentDetails'
// styling
import styles from './styles'

const Content = ({ classes, ...restProps }) => {
  const [
    active,
    setActive,
  ] = useState('1')

  const onTabChange = (event, activeTab) => {
    setActive(activeTab)
  }

  const invoiceButtonClass = classnames({
    [classes.printInvoiceBtn]: true,
    [classes.hidden]: active !== 0,
  })

  const addContent = (type) => {
    switch (type) {
      case 1:
        return <InvoiceDetails {...restProps} />
      case 2:
        return <PaymentDetails invoiceDetail={restProps.values} />
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
      name: 'Payment',
      content: addContent(2),
    },
  ]

  return (
    <React.Fragment>
      <Button className={invoiceButtonClass} size='sm' color='primary' icon>
        <Printer />Print Invoice
      </Button>
      {/* <NavPills
        color='primary'
        active={active}
        onChange={onTabChange}
        tabs={[
          {
            tabButton: 'Invoice',
            tabContent: <InvoiceDetails {...restProps} />,
          },
          {
            tabButton: 'Payment',
            tabContent: <PaymentDetails invoiceDetail={restProps.values} />,
          },
        ]}
      /> */}

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
