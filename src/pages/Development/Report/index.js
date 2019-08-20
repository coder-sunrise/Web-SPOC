import React from 'react'
import moment from 'moment'
import { connect } from 'dva'
// common component
import { Button, CardContainer, CommonModal } from '@/components'
// component
import ReportViewer from './ReportViewer'

@connect(({ codetable }) => ({ codetable }))
class Report extends React.Component {
  state = {
    showReport: false,
  }

  componentDidMount () {
    const today = moment()
    const utc = today.utc().set({ hour: 0, minute: 0, second: 0 })
    const time = '00:00:00'
    const date = today.format('DD-MM-YYYY')
    console.log({
      today,
      utcFormat: utc.format(),
      date: today.toDate(),
      formatted: today.format('DD-MM-YYYY'),
      new: moment.utc(`${date}T${time}`).local(),
    })
    const { dispatch } = this.props
    dispatch({
      type: 'codetable/watchFetchCodes',
    })
  }

  viewReport = () => {
    this.setState({ showReport: true })
  }

  closeModal = () => {
    this.setState({ showReport: false })
  }

  getCodeTable = () => {
    const code = 'ctnationality'
    const { dispatch } = this.props
    dispatch({
      type: 'codetable/fetchCodes',
      code,
    })
  }

  testWatch = () => {
    const { dispatch } = this.props
    dispatch({
      type: 'codetable/TEST',
    })
  }

  render () {
    const { showReport } = this.state
    return (
      <CardContainer hideHeader size='sm'>
        <Button color='primary&#39;' onClick={this.viewReport}>
          View Report
        </Button>
        <Button color='primary&#39;' onClick={this.getCodeTable}>
          Get Codetable
        </Button>
        <Button color='primary&#39;' onClick={this.testWatch}>
          Test Watch
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
