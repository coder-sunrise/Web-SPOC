import React, { memo, useState, useEffect } from 'react'
import { connect } from 'dva'
import classnames from 'classnames'
// material ui
import { Divider, Paper, withStyles } from '@material-ui/core'
// common component
import { primaryColor, dangerColor, grayColor } from 'mui-pro-jss'
import { Button } from '@/components'
// styling
// variables
import { flattenAppointmentDateToCalendarEvents } from '@/pages/Reception/Appointment'
import { StatusIndicator } from '../variables'
import { getCount, todayOnly } from '../utils'

const styles = () => ({
  container: {
    textAlign: 'center',
    marginLeft: '5px',
    marginRight: '5px',
    width: 100,
    minWidth: 'auto',
    '& button': {
      borderRadius: '0px !important',
      borderBottomRightRadius: '4px !important',
      borderBottomLeftRadius: '4px !important',
    },
  },
  rightEnd: {
    marginRight: 0,
  },
  number: {
    padding: '0px 10px',
    fontWeight: 500,
    margin: '2px 2px',
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

const initialStatusCount = {
  all: 0,
  waiting: 0,
  inProgress: 0,
  completed: 0,
  appointment: 0,
}

const StatusFilterButton = ({
  dispatch,
  classes,
  appointments = [],
  queueLog: { currentFilter, list },
}) => {
  const [
    statusCount,
    setStatusCount,
  ] = useState({ ...initialStatusCount })

  const onButtonClick = (event) => {
    const { id } = event.currentTarget

    dispatch({
      type: 'queueLog/updateFilter',
      status: id,
    })
  }

  useEffect(
    () => {
      const count = {
        all: getCount(StatusIndicator.ALL, list),
        waiting: getCount(StatusIndicator.WAITING, list),
        inProgress: getCount(StatusIndicator.IN_PROGRESS, list),
        completed: getCount(StatusIndicator.COMPLETED, list),
        appointment: appointments.length,
      }
      setStatusCount(count)
    },
    [
      list,
      appointments,
    ],
  )

  return (
    <React.Fragment>
      <Paper elevation={6} className={classnames(classes.container)}>
        <h4
          className={classnames([
            classes.number,
            classes.statusAll,
          ])}
        >
          {statusCount.all}
        </h4>
        <Divider variant='fullWidth' />

        <Button
          color='primary'
          size='sm'
          block
          id={StatusIndicator.ALL}
          onClick={onButtonClick}
          variant={
            currentFilter === StatusIndicator.ALL ? 'contained' : 'outlined'
          }
        >
          {StatusIndicator.ALL}
        </Button>
      </Paper>

      <Paper elevation={6} className={classnames(classes.container)}>
        <h4
          className={classnames([
            classes.number,
            classes.statusWaiting,
          ])}
        >
          {statusCount.waiting}
        </h4>
        <Divider variant='fullWidth' />

        <Button
          className={classes.button}
          color='primary'
          size='sm'
          block
          id={StatusIndicator.WAITING}
          onClick={onButtonClick}
          variant={
            currentFilter === StatusIndicator.WAITING ? 'contained' : 'outlined'
          }
        >
          {/* currentFilter === StatusIndicator.WAITING && <Check /> */}
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
          {statusCount.inProgress}
        </h4>
        <Divider variant='fullWidth' />

        <Button
          color='danger'
          size='sm'
          block
          id={StatusIndicator.IN_PROGRESS}
          onClick={onButtonClick}
          variant={
            currentFilter === StatusIndicator.IN_PROGRESS ? (
              'contained'
            ) : (
              'outlined'
            )
          }
        >
          {/* currentFilter === StatusIndicator.IN_PROGRESS && <Check /> */}
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
          {statusCount.completed}
        </h4>
        <Divider variant='fullWidth' />

        <Button
          size='sm'
          block
          onClick={onButtonClick}
          id={StatusIndicator.COMPLETED}
          variant={
            currentFilter === StatusIndicator.COMPLETED ? (
              'contained'
            ) : (
              'outlined'
            )
          }
        >
          {StatusIndicator.COMPLETED}
        </Button>
      </Paper>
      <Paper
        elevation={6}
        className={classnames({
          [classes.container]: true,
          [classes.rightEnd]: true,
        })}
      >
        <h4
          className={classnames([
            classes.number,
            classes.statusAll,
          ])}
        >
          {statusCount.appointment}
        </h4>
        <Divider variant='fullWidth' />

        <Button
          color='primary'
          size='sm'
          block
          id={StatusIndicator.APPOINTMENT}
          onClick={onButtonClick}
          variant={
            currentFilter === StatusIndicator.APPOINTMENT ? (
              'contained'
            ) : (
              'outlined'
            )
          }
        >
          {StatusIndicator.APPOINTMENT}
        </Button>
      </Paper>
    </React.Fragment>
  )
}

const ConnectedStatusFilterButton = connect(({ queueLog }) => ({
  queueLog,
  appointments: queueLog.appointmentList || [],
}))(StatusFilterButton)

export default memo(withStyles(styles)(ConnectedStatusFilterButton))
