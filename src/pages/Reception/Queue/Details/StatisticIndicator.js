import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
// umi
import { FormattedMessage } from 'umi/locale'
// material ui
import { Divider, Paper, withStyles } from '@material-ui/core'
// custom component
import { Button } from '@/components'
import { StatusIndicator } from '../variables'

const StatisticStyles = () => ({
  container: {
    textAlign: 'center',
    marginLeft: '5px',
    marginRight: '5px',
    width: '100px',
  },
  number: {
    padding: '0px 10px',
    fontWeight: 500,
    margin: '5px 2px',
  },
  statusAll: {
    color: '#000',
  },
  statusInProgress: {
    color: '#2196f3',
  },
  statusCompleted: {
    color: '#616161',
  },
  statusWaiting: {
    color: '#f50057',
  },
  status: { padding: '0px 10px', margin: '5px 0px', fontWeight: 400 },
})

class StatisticIndicator extends PureComponent {
  static propTypes = {
    handleStatusClick: PropTypes.func.isRequired,
  }

  onAllStatusClick = () => {
    const { handleStatusClick } = this.props
    handleStatusClick(StatusIndicator.ALL)
  }

  onWaitingStatusClick = () => {
    const { handleStatusClick } = this.props
    handleStatusClick(StatusIndicator.WAITING)
  }

  onInProgressStatusClick = () => {
    const { handleStatusClick } = this.props
    handleStatusClick(StatusIndicator.IN_PROGRESS)
  }

  onCompletedStatusClick = () => {
    const { handleStatusClick } = this.props
    handleStatusClick(StatusIndicator.COMPLETED)
  }

  render () {
    const { classes, filter } = this.props
    return (
      <React.Fragment>
        <Paper elevation={6} className={classnames(classes.container)}>
          <h4
            className={classnames([
              classes.number,
              classes.statusAll,
            ])}
          >
            6
          </h4>
          <Divider variant='fullWidth' />
          <Button
            size='sm'
            block
            color='primary'
            onClick={this.onAllStatusClick}
            simple={filter !== StatusIndicator.ALL}
          >
            <FormattedMessage id='reception.queue.status.all' />
          </Button>
        </Paper>
        <Paper elevation={6} className={classnames(classes.container)}>
          <h4
            className={classnames([
              classes.number,
              classes.statusWaiting,
            ])}
          >
            1
          </h4>
          <Divider variant='fullWidth' />
          <Button
            size='sm'
            block
            color='primary'
            onClick={this.onWaitingStatusClick}
            simple={filter !== StatusIndicator.WAITING}
          >
            <FormattedMessage id='reception.queue.status.waiting' />
          </Button>
        </Paper>
        <Paper elevation={6} className={classnames(classes.container)}>
          <h4
            className={classnames([
              classes.number,
              classes.statusInProgress,
            ])}
          >
            1
          </h4>
          <Divider variant='fullWidth' />

          <Button
            size='sm'
            block
            color='primary'
            onClick={this.onInProgressStatusClick}
            simple={filter !== StatusIndicator.IN_PROGRESS}
          >
            <FormattedMessage id='reception.queue.status.inProgress' />
          </Button>
        </Paper>
        <Paper elevation={6} className={classnames(classes.container)}>
          <h4
            className={classnames([
              classes.number,
              classes.statusCompleted,
            ])}
          >
            4
          </h4>
          <Divider variant='fullWidth' />
          <Button
            size='sm'
            block
            color='primary'
            onClick={this.onCompletedStatusClick}
            simple={filter !== StatusIndicator.COMPLETED}
          >
            <FormattedMessage id='reception.queue.status.completed' />
          </Button>
        </Paper>
      </React.Fragment>
    )
  }
}

export default withStyles(StatisticStyles)(StatisticIndicator)
