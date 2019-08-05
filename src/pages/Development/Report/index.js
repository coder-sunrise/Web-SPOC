import React from 'react'
// common component
import { Button, CardContainer, CommonModal } from '@/components'
// component
import ReportViewer from './ReportViewer'

class Report extends React.Component {
  state = {
    showReport: false,
  }

  viewReport = () => {
    this.setState({ showReport: true })
  }

  closeModal = () => {
    this.setState({ showReport: false })
  }

  render () {
    const { showReport } = this.state
    return (
      <CardContainer hideHeader size='sm'>
        <Button color='primary&#39;' onClick={this.viewReport}>
          View Report
        </Button>
        <CommonModal
          open={showReport}
          onClose={this.closeModal}
          title='Report'
          maxWidth='lg'
        >
          <ReportViewer />
        </CommonModal>
      </CardContainer>
    )
  }
}

export default Report
