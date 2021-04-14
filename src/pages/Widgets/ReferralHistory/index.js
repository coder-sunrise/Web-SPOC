import React, { Component } from 'react'
import { withStyles } from '@material-ui/core'
import {
  GridContainer,
  CardContainer,
  GridItem,
  CommonModal,
} from '@/components'
import { connect } from 'dva'
import Authorized from '@/utils/Authorized'
import ReferralGrid from './ReferralGrid'
import ReferralDetails from './ReferralDetails'

const styles = () => ({})

@connect(({ patientHistory, clinicSettings, codetable, user }) => ({
  patientHistory,
  clinicSettings,
  codetable,
  user,
}))
class PatientReferral extends Component {
  state = {
    showReferralHistoryDetails: false,
    onClickedRowData: {},
  }

  componentWillMount () {
    const { dispatch, patientHistory } = this.props

    dispatch({
      type: 'patientHistory/queryReferralHistory',
      payload: {
        pagesize: 999,
        patientProfileFK: patientHistory.patientID,
      },
    })
  }

  onEditReferralHistoryClicked = async (row) => {
    this.setState({ showReferralHistoryDetails: true, onClickedRowData: row })
  }

  closeReferralHistoryDetailsModal = () => {
    this.setState({ showReferralHistoryDetails: false })
  }

  render () {
    const { showReferralHistoryDetails, onClickedRowData } = this.state
    return (
      <Authorized authority='patientdatabase.patientprofiledetails.patienthistory.referralhistory'>
        {({ rights: referralhistoryAccessRight }) => (
          <Authorized.Context.Provider
            value={{
              rights:
                referralhistoryAccessRight === 'readwrite' ||
                referralhistoryAccessRight === 'enable'
                  ? 'enable'
                  : referralhistoryAccessRight,
            }}
          >
            <React.Fragment>
              <CardContainer hideHeader size='sm'>
                <GridContainer>
                  <GridItem md={12}>
                    <ReferralGrid
                      onEditReferralHistoryClicked={
                        this.onEditReferralHistoryClicked
                      }
                      {...this.props}
                    />
                  </GridItem>
                  <CommonModal
                    open={showReferralHistoryDetails}
                    title='Edit Visit Referral'
                    maxWidth='sm'
                    bodyNoPadding
                    onConfirm={this.closeReferralHistoryDetailsModal}
                    onClose={this.closeReferralHistoryDetailsModal}
                    observe='patientReferralHistoryDetails'
                  >
                    <ReferralDetails
                      onClickedRowData={onClickedRowData}
                      {...this.props}
                    />
                  </CommonModal>
                </GridContainer>
              </CardContainer>
            </React.Fragment>
          </Authorized.Context.Provider>
        )}
      </Authorized>
    )
  }
}

export default withStyles(styles, { withTheme: true })(PatientReferral)
