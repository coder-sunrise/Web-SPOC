import React, { PureComponent } from 'react'
import classnames from 'classnames'
// umi
import { FormattedMessage } from 'umi/locale'
// material ui
import { Divider, Paper, withStyles } from '@material-ui/core'

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
  render () {
    const {
      classes,
      filter,
      statistic: { all, waiting, inProgress, completed } = {
        all: 0,
        waiting: 0,
        inProgress: 0,
        completed: 0,
      },
    } = this.props
    return (
      <React.Fragment>
        <Paper elevation={6} className={classnames(classes.container)}>
          <h4
            className={classnames([
              classes.number,
              classes.statusAll,
            ])}
          >
            {all}
          </h4>
          <Divider variant='fullWidth' />
          <p className={classnames(classes.status)}>
            <FormattedMessage id='reception.queue.status.all' />
          </p>
        </Paper>
        <Paper elevation={6} className={classnames(classes.container)}>
          <h4
            className={classnames([
              classes.number,
              classes.statusWaiting,
            ])}
          >
            {waiting}
          </h4>
          <Divider variant='fullWidth' />
          <p className={classnames(classes.status)}>
            <FormattedMessage id='reception.queue.status.waiting' />
          </p>
        </Paper>
        <Paper elevation={6} className={classnames(classes.container)}>
          <h4
            className={classnames([
              classes.number,
              classes.statusInProgress,
            ])}
          >
            {inProgress}
          </h4>
          <Divider variant='fullWidth' />
          <p className={classnames(classes.status)}>
            <FormattedMessage id='reception.queue.status.inProgress' />
          </p>
        </Paper>
        <Paper elevation={6} className={classnames(classes.container)}>
          <h4
            className={classnames([
              classes.number,
              classes.statusCompleted,
            ])}
          >
            {completed}
          </h4>
          <Divider variant='fullWidth' />
          <p className={classnames(classes.status)}>
            <FormattedMessage id='reception.queue.status.completed' />
          </p>
        </Paper>
      </React.Fragment>
    )
  }
}

export default withStyles(StatisticStyles)(StatisticIndicator)
