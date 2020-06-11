import React, { PureComponent, useEffect } from 'react'
import { withStyles } from '@material-ui/core'
import { Tabs } from '@/components'
import { PATIENT_HISTORY_TABS } from '@/utils/constants'
import PatientNurseNotes from '@/pages/Widgets/PatientNurseNotes'
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

  getTabOptions = () => {
    return [
      {
        id: PATIENT_HISTORY_TABS.VISIT,
        name: 'Visit',
        content: <PatientHistory mode='integrated' {...this.props} />,
      },
      {
        id: PATIENT_HISTORY_TABS.NURSENOTES,
        name: 'Nurse Notes',
        content: <PatientNurseNotes {...this.props} />,
      },
    ]
  }

  render () {
    return (
      <Tabs
        activeKey={this.state.activeTab}
        onChange={(e) => this.setActiveTab(e)}
        options={this.getTabOptions()}
      />
    )
  }
}

export default withStyles(styles, { withTheme: true })(
  HistoryDisplayForConsultation,
)
