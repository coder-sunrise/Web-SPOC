import React, { PureComponent } from 'react'
import { connect } from 'dva'
import classnames from 'classnames'
// material ui
import { Divider, Paper, withStyles } from '@material-ui/core'
import Check from '@material-ui/icons/ArrowForward'
// common component
import { Button } from '@/components'
// styling
import { primaryColor, dangerColor, grayColor } from 'mui-pro-jss'
// variables
import { StatusIndicator } from '../variables'
import { getStatisticCount } from '../utils'

const StatisticStyles = () => ({
  container: {
    textAlign: 'center',
    marginLeft: '5px',
    marginRight: '5px',
    width: '120px',
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
    color: dangerColor,
  },
  statusCompleted: {
    color: grayColor,
  },
  statusWaiting: {
    color: primaryColor,
  },
  status: { padding: '0px 10px', margin: '5px 0px', fontWeight: 400 },
})

@connect(({ queueLog }) => ({ queueLog }))
class StatisticIndicator extends PureComponent {
  onButtonClick = (event) => {
    const { dispatch } = this.props
    const { id } = event.currentTarget

    dispatch({
      type: 'queueLog/updateFilter',
      status: id,
    })
  }

  render () {
    const { classes, queueLog: { currentFilter, queueListing } } = this.props

    const statistic = {
      all: getStatisticCount(StatusIndicator.ALL, queueListing),
      appointment: getStatisticCount(StatusIndicator.APPOINTMENT, queueListing),
      waiting: getStatisticCount(StatusIndicator.WAITING, queueListing),
      inProgress: getStatisticCount(StatusIndicator.IN_PROGRESS, queueListing),
      completed: getStatisticCount(StatusIndicator.COMPLETED, queueListing),
    }

    return (
      <React.Fragment>
        <Paper elevation={6} className={classnames(classes.container)}>
          <h4
            className={classnames([
              classes.number,
              classes.statusAll,
            ])}
          >
            {statistic.all}
          </h4>
          <Divider variant='fullWidth' />

          <Button
            color='primary'
            size='sm'
            block
            id={StatusIndicator.ALL}
            onClick={this.onButtonClick}
            simple
          >
            {currentFilter === StatusIndicator.ALL && <Check />}
            {StatusIndicator.ALL}
          </Button>
        </Paper>
        <Paper elevation={6} className={classnames(classes.container)}>
          <h4
            className={classnames([
              classes.number,
              classes.statusAll,
            ])}
          >
            {statistic.appointment}
          </h4>
          <Divider variant='fullWidth' />

          <Button
            color='primary'
            size='sm'
            block
            id={StatusIndicator.APPOINTMENT}
            onClick={this.onButtonClick}
            simple
          >
            {currentFilter === StatusIndicator.APPOINTMENT && <Check />}
            {StatusIndicator.APPOINTMENT}
          </Button>
        </Paper>
        <Paper elevation={6} className={classnames(classes.container)}>
          <h4
            className={classnames([
              classes.number,
              classes.statusWaiting,
            ])}
          >
            {statistic.waiting}
          </h4>
          <Divider variant='fullWidth' />

          <Button
            color='primary'
            size='sm'
            block
            id={StatusIndicator.WAITING}
            onClick={this.onButtonClick}
          >
            {currentFilter === StatusIndicator.WAITING && <Check />}
            {StatusIndicator.WAITING}
          </Button>
        </Paper>
        <Paper elevation={6} className={classnames(classes.container)}>
          <h4
            className={classnames([
              classes.number,
              classes.statusInProgress,
            ])}
          >
            {statistic.inProgress}
          </h4>
          <Divider variant='fullWidth' />

          <Button
            color='danger'
            size='sm'
            block
            id={StatusIndicator.IN_PROGRESS}
            onClick={this.onButtonClick}
          >
            {currentFilter === StatusIndicator.IN_PROGRESS && <Check />}
            {StatusIndicator.IN_PROGRESS}
          </Button>
        </Paper>
        <Paper elevation={6} className={classnames(classes.container)}>
          <h4
            className={classnames([
              classes.number,
              classes.statusCompleted,
            ])}
          >
            {statistic.completed}
          </h4>
          <Divider variant='fullWidth' />

          <Button
            size='sm'
            block
            onClick={this.onButtonClick}
            id={StatusIndicator.COMPLETED}
          >
            {currentFilter === StatusIndicator.COMPLETED && <Check />}
            {StatusIndicator.COMPLETED}
          </Button>
        </Paper>
      </React.Fragment>
    )
  }
}

export default withStyles(StatisticStyles)(StatisticIndicator)
