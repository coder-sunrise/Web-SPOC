import React from 'react'
// common components
import { CommonModal, CardContainer, NavPills } from '@/components'
import ClaimDetails from '../common/ClaimDetails'

import New from './New'
import Draft from './Draft'

class Medisave extends React.Component {
  navigateToInvoiceDetails = (row) => {
    const { invoiceNo } = row
    const processedInvoiceNo = invoiceNo.replace('/', '-')
    // router.push(`/claim-submission/Medisave/invoice/${processedInvoiceNo}`)
  }

  handleContextMenuItemClick = (currentTarget, row) => {
    const { id } = currentTarget
    switch (id) {
      case '0':
        this.openClaimDetails({ claimDetails: row })
        break
      case '1':
        this.navigateToInvoiceDetails(row)
        break
      default:
        break
    }
  }

  openClaimDetails = () => {}

  render () {
    return (
      <CardContainer hideHeader size='sm'>
        <NavPills
          active={0}
          tabs={[
            {
              tabButton: 'Draft',
              tabContent: (
                <Draft
                  handleContextMenuItemClick={this.handleContextMenuItemClick}
                />
              ),
            },
            {
              tabButton: 'New',
              tabContent: (
                <New
                  handleContextMenuItemClick={this.handleContextMenuItemClick}
                />
              ),
            },
          ]}
        />
        {/* <CommonModal
          title='Claim Details'
          open={showClaimDetails}
          onClose={this.closeClaimDetails}
          onConfirm={this.closeClaimDetails}
        >
          <ClaimDetails claimDetails={claimDetails} />
        </CommonModal> */}
      </CardContainer>
    )
  }
}

export default Medisave
