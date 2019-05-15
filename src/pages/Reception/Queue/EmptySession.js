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

class EmptySession extends PureComponent {
  state = {
    isLoading: false,
  }

  onStartClick = () => {
    const { handleStartSession } = this.props
    this.setState(
      {
        isLoading: true,
      },
      () => setTimeout(handleStartSession, 2000),
    )
  }

  render () {
    const { isLoading } = this.state
    const { classes } = this.props
    return (
      <div className={classnames(classes.emptyStateContainer)}>
        <div className={classnames(classes.content)}>
          <h3>
            <FormattedMessage id='reception.queue.emptyState' />
          </h3>
          {!isLoading ? (
            <Button color='primary' onClick={this.onStartClick}>
              <PlayCircleOutline />
              <FormattedMessage id='reception.queue.startSession' />
            </Button>
          ) : (
            <React.Fragment>
              <LinearProgress />
              <FormattedMessage id='reception.queue.startingASession' />
            </React.Fragment>
          )}
        </div>
      </div>
    )
  }
}

export default withStyles(STYLES)(EmptySession)
