import React, { PureComponent } from 'react'
import classnames from 'classnames'
// umi
import { FormattedMessage } from 'umi/locale'
// material ui
import { LinearProgress, withStyles } from '@material-ui/core'
import { PlayCircleOutline } from '@material-ui/icons'
// custom components
import { Button } from '@/components'

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

const LOADING_KEY = {
  GET_SESSION_INFO: 'queueLog/getSessionInfo',
  START_SESSION: 'queueLog/startSession',
}

class EmptySession extends PureComponent {
  onStartClick = () => {
    const { handleStartSession } = this.props
    handleStartSession()
  }

  render () {
    const { classes, loadingProps } = this.props

    return (
      <div className={classnames(classes.emptyStateContainer)}>
        <div className={classnames(classes.content)}>
          {loadingProps.effects[LOADING_KEY.GET_SESSION_INFO] && (
            <React.Fragment>
              <LinearProgress />
              <FormattedMessage id='reception.queue.gettingSessionInfo' />
            </React.Fragment>
          )}
          {loadingProps.effects[LOADING_KEY.START_SESSION] && (
            <React.Fragment>
              <LinearProgress />
              <FormattedMessage id='reception.queue.startingASession' />
            </React.Fragment>
          )}
          {!loadingProps.effects[LOADING_KEY.GET_SESSION_INFO] &&
          !loadingProps.effects[LOADING_KEY.START_SESSION] && (
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
