import React, { PureComponent } from 'react'
import { connect } from 'dva'
import classnames from 'classnames'
// umi
import { FormattedMessage } from 'umi/locale'
// material ui
import { Divider, Paper, withStyles } from '@material-ui/core'
// ant design
import { Switch } from 'antd'
// common component
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

@connect(({ queueLog }) => ({ queueLog }))
class StatisticIndicator extends PureComponent {
  state = {
    currentFilter: StatusIndicator.ALL,
  }

  onButtonClick = (event) => {
    const { handleStatusClick, dispatch } = this.props
    const { id } = event.currentTarget
    // this.setState({ currentFilter: id })
    // handleStatusClick(id)
    dispatch({
      type: 'queueLog/updateFilter',
      status: id,
    })
  }

  render () {
    const {
      classes,
      statistic: { all, appointment, waiting, inProgress, completed } = {
        all: 0,
        appointment: 0,
        waiting: 0,
        inProgress: 0,
        completed: 0,
      },
      // currentFilter,
      queueLog: { currentFilter },
    } = this.props

    // const { currentFilter } = this.state

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

          <Button
            color='primary'
            size='sm'
            block
            id={StatusIndicator.ALL}
            onClick={this.onButtonClick}
            simple={currentFilter !== StatusIndicator.ALL}
          >
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
            {appointment}
          </h4>
          <Divider variant='fullWidth' />

          <Button
            color='primary'
            size='sm'
            block
            id={StatusIndicator.APPOINTMENT}
            onClick={this.onButtonClick}
            simple={currentFilter !== StatusIndicator.APPOINTMENT}
          >
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
            {waiting}
          </h4>
          <Divider variant='fullWidth' />

          <Button
            color='primary'
            size='sm'
            block
            id={StatusIndicator.WAITING}
            onClick={this.onButtonClick}
            simple={currentFilter !== StatusIndicator.WAITING}
          >
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
            {inProgress}
          </h4>
          <Divider variant='fullWidth' />

          <Button
            color='primary'
            size='sm'
            block
            id={StatusIndicator.IN_PROGRESS}
            onClick={this.onButtonClick}
            simple={currentFilter !== StatusIndicator.IN_PROGRESS}
          >
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
            {completed}
          </h4>
          <Divider variant='fullWidth' />

          <Button
            color='primary'
            size='sm'
            block
            onClick={this.onButtonClick}
            id={StatusIndicator.COMPLETED}
            simple={currentFilter !== StatusIndicator.COMPLETED}
          >
            {StatusIndicator.COMPLETED}
          </Button>
        </Paper>
      </React.Fragment>
    )
  }
}

export default withStyles(StatisticStyles)(StatisticIndicator)
