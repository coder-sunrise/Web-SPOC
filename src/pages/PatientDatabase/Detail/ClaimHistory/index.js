import React, { useState, useEffect, useRef } from 'react'
import { connect } from 'dva'
import moment from 'moment'
import { compose } from 'redux'
import { Edit, Info } from '@material-ui/icons'
import Authorized from '@/utils/Authorized'
import { withStyles } from '@material-ui/core/styles'
import { Tooltip, Button, CommonModal, Tabs } from '@/components'
import ClaimTracking from './ClaimTracking'
import NonClaimableHistory from './NonClaimableHistory'

const claimHistoryTabs = props => {
  const viewClaimTrackingRight = Authorized.check(
    'patientdatabase.patientprofiledetails.claimhistory.viewclaimtracking',
  ) || { rights: 'hidden' }
  const viewNonClaimableHistoryRight = Authorized.check(
    'patientdatabase.patientprofiledetails.claimhistory.viewnonclaimablehistory',
  ) || { rights: 'hidden' }

  let options = []
  if (viewClaimTrackingRight.rights === 'enable') {
    options.push({
      id: 0,
      name: <span>Claim Tracking</span>,
      content: <ClaimTracking {...props} />,
    })

    if (viewNonClaimableHistoryRight.rights === 'enable') {
      options.push({
        id: 1,
        name: <span>Non Claimable History</span>,
        content: <NonClaimableHistory {...props} />,
      })
    }
  } else if (viewNonClaimableHistoryRight.rights === 'enable') {
    options.push({
      id: 0,
      name: <span>Non Claimable History</span>,
      content: <NonClaimableHistory {...props} />,
    })
  }
  return options
}

const styles = () => ({})

const ClaimHistory = props => {
  const { theme, defaultTab = 'ClaimTracking' } = props

  const tabOptions = claimHistoryTabs(props)

  let defaultTabIndex = '0'
  if (defaultTab === 'NonClaimableHistory' && tabOptions.length > 1) {
    defaultTabIndex = '1'
  }

  const [activeTabIndex, setActiveTabIndex] = useState(defaultTabIndex)
  return (
    <div style={{ minHeight: 500 }}>
      <Tabs
        activeKey={activeTabIndex}
        options={tabOptions}
        onChange={key => {
          setActiveTabIndex(key)
        }}
      />
    </div>
  )
}

export default compose(withStyles(styles, { withTheme: true }))(ClaimHistory)
