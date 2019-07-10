import React from 'react'
// common components
import { CommonModal, CardContainer, NavPills } from '@/components'
import ClaimDetails from '../common/ClaimDetails'
import ClaimDetailsSection from './ClaimDetailsSection'

import New from './New'
import Draft from './Draft'

class Medisave extends React.Component {
  state = {
    showClaimDetails: false,
    claimDetails: {},
    claimDetailsReadOnly: false,
  }

  openClaimDetails = ({ claimDetails }) =>
    this.setState({ showClaimDetails: true, claimDetails })

  closeClaimDetails = () =>
    this.setState({ showClaimDetails: false, claimDetails: {} })

  navigateToInvoiceDetails = (row) => {
    const { invoiceNo } = row
    const processedInvoiceNo = invoiceNo.replace('/', '-')
    this.props.history.push(
      `/claim-submission/medisave/invoice/${processedInvoiceNo}`,
    )
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

  onTabChange = (_, active) => {
    this.setState({ claimDetailsReadOnly: active === 0 })
  }

  render () {
    const { showClaimDetails, claimDetails, claimDetailsReadOnly } = this.state
    return (
      <CardContainer hideHeader size='sm'>
        <NavPills
          active={0}
          onChange={this.onTabChange}
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
        <CommonModal
          title='Claim Details'
          open={showClaimDetails}
          onClose={this.closeClaimDetails}
          onConfirm={this.closeClaimDetails}
        >
          <ClaimDetails
            claimDetails={claimDetails}
            readOnly={claimDetailsReadOnly}
            ClaimDetailsSection={ClaimDetailsSection}
          />
        </CommonModal>
      </CardContainer>
    )
  }
}

export default Medisave
