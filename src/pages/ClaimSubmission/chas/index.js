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
    activeTab: '2',
    allowEdit: false,
  }

  openClaimDetails = (allowEdit) =>
    this.setState({ showClaimDetails: true, allowEdit })

  openSubmitClaimStatus = (count) =>
    this.setState({ showSubmitClaimStatus: true, failedCount: count })

  closeClaimDetails = () =>
    this.setState({
      showClaimDetails: false,
      claimDetails: {},
      allowEdit: false,
    })

  closeSubmitClaimStatus = () =>
    this.setState({ showSubmitClaimStatus: false, failedCount: 0 })

  navigateToInvoiceDetails = (row) => {
    const { history } = this.props
    const { invoiceFK } = row
    history.push(`/claim-submission/chas/invoice/details?id=${invoiceFK}`)
  }

  handleContextMenuItemClick = (row, id, allowEdit = false) => {
    const { dispatch } = this.props
    switch (id) {
      case '0':
        dispatch({
          type: 'claimSubmission/queryById',
          payload: {
            id: row.id,
          },
        }).then((r) => {
          if (r) this.openClaimDetails(allowEdit)
        })
        break
      case '1':
        // this.navigateToInvoiceDetails(row)
        dispatch({
          type: 'claimSubmission/queryById',
          payload: {
            id: row.id,
          },
        }).then((r) => {
          if (r) this.navigateToInvoiceDetails(r.payload)
        })
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
      allowEdit,
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
          defaultActivekey='2'
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
          <ClaimDetails claimDetails={claimDetails} allowEdit={allowEdit} />
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
