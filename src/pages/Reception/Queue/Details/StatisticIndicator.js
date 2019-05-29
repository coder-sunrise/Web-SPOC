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
    const { classes } = this.props
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
            1
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
            1
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
            4
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
