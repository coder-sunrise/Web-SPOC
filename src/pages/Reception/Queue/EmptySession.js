import React, { PureComponent } from 'react'
import classnames from 'classnames'
// umi
import { FormattedMessage } from 'umi/locale'
// material ui
import { LinearProgress, withStyles } from '@material-ui/core'
import PlayCircleOutline from '@material-ui/icons/PlayCircleOutline'
// custom components
import Stop from '@material-ui/icons/Stop'
import { Button, Danger } from '@/components'
import Authorized from '@/utils/Authorized'
import { getBizSession } from '@/services/queue'

const STYLES = () => ({
  emptyStateContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '50vh',
    width: '100%',
  },
  content: {
    textAlign: 'center',
  },
})

class EmptySession extends PureComponent {
  state = {
    isLastSessionClosed: false,
  }

  componentDidMount () {
    this.checkLastSession()
  }

  checkLastSession = async () => {
    try {
      const bizSessionPayload = {
        pagesize: 1,
        sorting: [
          { columnName: 'sessionStartDate', direction: 'desc' },
        ],
      }
      const result = await getBizSession(bizSessionPayload)
      const { data } = result.data

      this.setState(() => {
        return {
          isLastSessionClosed: data.length > 0 && data[0].isClinicSessionClosed,
        }
      })
    } catch (error) {
      console.log({ error })
    }
  }

  onStartClick = () => {
    const { handleStartSession } = this.props
    handleStartSession()
  }

  onReopenClick = () => {
    const { handleReopenLastSession } = this.props
    handleReopenLastSession()
  }

  render () {
    const { classes, loading, sessionInfo } = this.props
    const { id } = sessionInfo
    const showLoading = loading.effects['queueLog/getSessionInfo']
    const showStartSession = id === ''
    const { isLastSessionClosed } = this.state

    return (
      <div className={classnames(classes.emptyStateContainer)}>
        <div className={classnames(classes.content)}>
          {showLoading && (
            <React.Fragment>
              <h3>
                <FormattedMessage id='reception.queue.gettingSessionInfo' />
              </h3>
              <LinearProgress />
            </React.Fragment>
          )}
          {!showLoading &&
          showStartSession && (
            <React.Fragment>
              <h3>
                <FormattedMessage id='reception.queue.emptyState' />
              </h3>
              <Authorized authority='queue.startsession'>
                <Button color='primary' onClick={this.onStartClick}>
                  <PlayCircleOutline />
                  <FormattedMessage id='reception.queue.startSession' />
                </Button>
              </Authorized>
              {isLastSessionClosed && (
                <Authorized authority='queue.reopenlastsession'>
                  <Button color='primary' onClick={this.onReopenClick}>
                    <Stop />
                    <FormattedMessage id='reception.queue.reopenLastSession' />
                  </Button>
                </Authorized>
              )}
            </React.Fragment>
          )}
        </div>
      </div>
    )
  }
}

export default withStyles(STYLES)(EmptySession)
