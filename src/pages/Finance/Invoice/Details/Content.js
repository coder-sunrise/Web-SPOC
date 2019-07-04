import React, { useState } from 'react'
import classnames from 'classnames'
// material ui
import { withStyles } from '@material-ui/core/styles'
import Printer from '@material-ui/icons/Print'
// common components
import { Button, NavPills } from '@/components'
// sub components
import InvoiceDetails from './InvoiceDetails'
// styling
import styles from './styles'

const Content = ({ classes }) => {
  const [
    active,
    setActive,
  ] = useState(0)

  const onTabChange = (event, activeTab) => {
    setActive(activeTab)
  }

  const invoiceButtonClass = classnames({
    [classes.printInvoiceBtn]: true,
    [classes.hidden]: active !== 0,
  })

  return (
    <React.Fragment>
      <Button className={invoiceButtonClass} size='sm' color='primary' icon>
        <Printer />Print Invoice
      </Button>
      <NavPills
        color='primary'
        active={active}
        onChange={onTabChange}
        tabs={[
          { tabButton: 'Invoice', tabContent: <InvoiceDetails /> },
          { tabButton: 'Payment', tabContent: <div>Payment</div> },
        ]}
      />
    </React.Fragment>
  )
}

export default withStyles(styles, { name: 'InvoiceNavPills' })(Content)
