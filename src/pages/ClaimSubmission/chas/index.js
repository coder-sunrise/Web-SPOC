import React from 'react'
import { connect } from 'dva'
// common components
import { CommonModal, Tabs } from '@/components'
// sub components
import ClaimDetails from '../common/ClaimDetails'
import SubmitClaimStatus from '../common/SubmitClaimStatus'
import { ClaimSubmissionChasTabOption } from './variables'

@connect(({ claimSubmission, global }) => ({
  claimSubmission,
  global,
}))
class CHAS extends React.Component {
  state = {
    showClaimDetails: false,
    showSubmitClaimStatus: false,
    failedCount: 0,
    claimDetails: {},
    activeTab: '4',
  }

  openClaimDetails = () => this.setState({ showClaimDetails: true })

  openSubmitClaimStatus = (count) =>
    this.setState({ showSubmitClaimStatus: true, failedCount: count })

  closeClaimDetails = () =>
    this.setState({ showClaimDetails: false, claimDetails: {} })

  closeSubmitClaimStatus = () =>
    this.setState({ showSubmitClaimStatus: false, failedCount: 0 })

  navigateToInvoiceDetails = (row) => {
    const { history } = this.props
    const { invoiceNo } = row
    const processedInvoiceNo = invoiceNo.replace('/', '-')

    history.push(`/claim-submission/chas/invoice/${processedInvoiceNo}`)
  }

  handleContextMenuItemClick = (row, id) => {
    const { dispatch } = this.props
    switch (id) {
      case '0':
        dispatch({
          type: 'claimSubmission/queryById',
          payload: {
            id: row.id,
          },
        }).then((r) => {
          if (r) this.openClaimDetails()
        })
        break
      case '1':
        this.navigateToInvoiceDetails(row.id)
        break
      default:
        break
    }
  }

  onChangeTab = (e) => {
    this.setState({ activeTab: e })
  }

  render () {
    const {
      showClaimDetails,
      showSubmitClaimStatus,
      failedCount,
      claimDetails,
    } = this.state
    const claimSubmissionActionProps = {
      handleContextMenuItemClick: this.handleContextMenuItemClick,
      handleSubmitClaimStatus: this.openSubmitClaimStatus,
    }
    const { activeTab } = this.state

    return (
      // <CardContainer hideHeader size='sm'>
      <React.Fragment>
        <Tabs
          style={{ marginTop: 20 }}
          activeKey={activeTab}
          defaultActivekey='4'
          onChange={this.onChangeTab}
          options={ClaimSubmissionChasTabOption(claimSubmissionActionProps)}
        />
        {/* <NavPills
          active={1}
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
                  handleSubmitClaimStatus={this.openSubmitClaimStatus}
                  handleContextMenuItemClick={this.handleContextMenuItemClick}
                />
              ),
            },
            {
              tabButton: 'Submitted',
              tabContent: (
                <Submitted
                  handleContextMenuItemClick={this.handleContextMenuItemClick}
                />
              ),
            },
            {
              tabButton: 'Approved',
              tabContent: (
                <Approved
                  handleContextMenuItemClick={this.handleContextMenuItemClick}
                />
              ),
            },
            {
              tabButton: 'Rejected',
              tabContent: (
                <Rejected
                  handleContextMenuItemClick={this.handleContextMenuItemClick}
                />
              ),
            },
          ]}
        /> */}
        <CommonModal
          title='Claim Details'
          open={showClaimDetails}
          onClose={this.closeClaimDetails}
          onConfirm={this.closeClaimDetails}
        >
          <ClaimDetails claimDetails={claimDetails} />
        </CommonModal>

        <CommonModal
          title='Submit Claim Status'
          maxWidth='xs'
          open={showSubmitClaimStatus}
          onClose={this.closeSubmitClaimStatus}
          onConfirm={this.closeSubmitClaimStatus}
        >
          <SubmitClaimStatus count={failedCount} />
        </CommonModal>
      </React.Fragment>
      // </CardContainer>
    )
  }
}

export default CHAS
