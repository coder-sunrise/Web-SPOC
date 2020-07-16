import React, { PureComponent, useEffect } from 'react'
import { withStyles } from '@material-ui/core'
import { Tabs } from '@/components'
import { PATIENT_HISTORY_TABS } from '@/utils/constants'
// import PatientNurseNotes from '@/pages/Widgets/PatientNurseNotes'
import DispenseHistory from '@/pages/Widgets/DispenseHistory'
import Authorized from '@/utils/Authorized'
import PatientHistory from './index'

const styles = () => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    height: 'calc(100vh - 80px)',
  },
})

class HistoryDisplayForConsultation extends PureComponent {
  constructor () {
    super()
    this.state = {
      activeTab: '1',
    }
  }

  componentDidMount () {}

  setActiveTab = (e) => {
    this.setState({ activeTab: e })
  }

  checkAccessRight = (accessRightNames) => {
    if (!accessRightNames || accessRightNames.length === 0) return true

    for (let i = 0; i < accessRightNames.length; i++) {
      const accessRight = Authorized.check(accessRightNames[i])
      if (accessRight.rights === 'enable') return true
    }
    return false
  }

  getTabOptions = () => {
    const tabs = [
      {
        id: PATIENT_HISTORY_TABS.VISIT,
        name: 'Visit',
        content: <PatientHistory mode='integrated' {...this.props} />,
      },
      {
        id: PATIENT_HISTORY_TABS.DISPENSE,
        name: 'Dispense',
        content: <DispenseHistory mode='integrated' {...this.props} />,
      },
    ]
    return tabs.filter((f) => this.checkAccessRight(f.authority))
  }

  render () {
    const tabOpts = this.getTabOptions()
    if (tabOpts) {
      if (tabOpts.length === 1) {
        const { content } = tabOpts[0]
        return content
      }
      return (
        <Tabs
          activeKey={this.state.activeTab}
          onChange={(e) => this.setActiveTab(e)}
          options={this.getTabOptions()}
        />
      )
    }
    return null
  }
}

export default withStyles(styles, { withTheme: true })(
  HistoryDisplayForConsultation,
)
