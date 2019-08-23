import React, { PureComponent } from 'react'
import classnames from 'classnames'
// umi
import { FormattedMessage } from 'umi/locale'
// material ui
import { LinearProgress, withStyles } from '@material-ui/core'
import PlayCircleOutline from '@material-ui/icons/PlayCircleOutline'
// custom components
import { Button, Danger } from '@/components'

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
  onStartClick = () => {
    const { handleStartSession } = this.props
    handleStartSession()
  }

  render () {
    const { classes, loading, sessionInfo } = this.props
    const { id } = sessionInfo
    const showLoading = loading.effects['queueLog/getSessionInfo']
    const showStartSession = id === ''

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
              <Button color='primary' onClick={this.onStartClick}>
                <PlayCircleOutline />
                <FormattedMessage id='reception.queue.startSession' />
              </Button>
            </React.Fragment>
          )}
        </div>
      </div>
    )
  }
}

export default withStyles(STYLES)(EmptySession)
