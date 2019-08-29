import React, { Component } from 'react'
import { NavPills } from '@/components'
import PurchaseOrder from './PO'

class index extends Component {
  render () {
    return (
      <NavPills
        active={0}
        tabs={[
          {
            tabButton: 'Purchase Details',
            tabContent: (
              <PurchaseOrder
              //     handleContextMenuItemClick={this.handleContextMenuItemClick}
              />
            ),
          },
          {
            tabButton: 'Delivery Order Details',
            // tabContent: (
            //   <New
            //     handleContextMenuItemClick={this.handleContextMenuItemClick}
            //   />
            //),
          },
          {
            tabButton: 'Payment',
            // tabContent: (
            //   <Submitted
            //     handleContextMenuItemClick={this.handleContextMenuItemClick}
            //   />
            //),
          },
        ]}
      />
    )
  }
}
export default index
