import React, { memo, useState, useEffect } from 'react'
import { connect } from 'dva'
import classnames from 'classnames'
// material ui
import { Divider, Paper, withStyles } from '@material-ui/core'
// common component
import {
  primaryColor,
  warningColor,
  successColor,
  grayColor,
  dangerColor,
} from 'mui-pro-jss'
import { Button } from '@/components'
// styling
// variables
import { flattenAppointmentDateToCalendarEvents } from '@/pages/Reception/Appointment'
import { StatusIndicator } from '../variables'
import { getCount, todayOnly } from '../utils'
import { CLINICAL_ROLE } from '@/utils/constants'

const styles = () => ({
  container: {
    textAlign: 'center',
    marginLeft: '4px',
    marginRight: '4px',
    width: 90,
    minWidth: 'auto',
    '& button': {
      borderRadius: '0px !important',
      borderBottomRightRadius: '4px !important',
      borderBottomLeftRadius: '4px !important',
      padding: '3px 0px!important',
    },
    cursor: 'pointer',
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
  statusDispense: {
    color: warningColor,
  },
  statusCompleted: {
    color: grayColor,
  },
  statusBilling: {
    color: successColor,
  },
  statusInCons: {
    color: 'red',
  },
  statusPast: {
    color: '#0070C0',
  },
  statusUngraded: {
    color: '#F7880D',
  },
  statusWaiting: {
    color: primaryColor,
  },
  status: { padding: '0px 10px', margin: '5px 0px', fontWeight: 400 },
})

const initialStatusCount = {
  all: 0,
  waiting: 0,
  dispense: 0,
  billing: 0,
  inCons: 0,
  ungraded: 0,
  completed: 0,
  past: 0,
  appointment: 0,
}

const StatusFilterButton = ({
  dispatch,
  classes,
  appointments = [],
  queueLog: { currentFilter, list },
  clinicRoleFK,
  doctorId,
  roomIds,
  doctorIds,
}) => {
  const [statusCount, setStatusCount] = useState({ ...initialStatusCount })

  const onButtonClick = event => {
    const { id } = event.currentTarget

    dispatch({
      type: 'queueLog/updateFilter',
      status: id,
    })
  }

  useEffect(() => {
    const count = {
      all: getCount(StatusIndicator.ALL, list, null, roomIds, doctorIds),
      waiting: getCount(
        StatusIndicator.WAITING,
        list,
        null,
        roomIds,
        doctorIds,
      ),
      dispense: getCount(
        StatusIndicator.DISPENSE,
        list,
        null,
        roomIds,
        doctorIds,
      ),
      billing: getCount(
        StatusIndicator.BILLING,
        list,
        null,
        roomIds,
        doctorIds,
      ),
      completed: getCount(
        StatusIndicator.COMPLETED,
        list,
        null,
        roomIds,
        doctorIds,
      ),
      inCons: getCount(StatusIndicator.IN_CONS, list, null, roomIds, doctorIds),
      ungraded: getCount(
        StatusIndicator.UNGRADED,
        list,
        null,
        roomIds,
        doctorIds,
      ),
      past: getCount(StatusIndicator.PAST, list, doctorId),
      appointment: appointments.length,
    }
    setStatusCount(count)
  }, [list, appointments])

  return (
    <React.Fragment>
      <Paper
        elevation={6}
        className={classnames(classes.container)}
        id={StatusIndicator.ALL}
        onClick={onButtonClick}
      >
        <h4 className={classnames([classes.number, classes.statusAll])}>
          {statusCount.all}
        </h4>
        <Divider variant='fullWidth' />

        <Button
          color='primary'
          size='sm'
          block
          style={{ height: 28, minWidth: 90 }}
          id={StatusIndicator.ALL}
          onClick={onButtonClick}
          variant={
            currentFilter === StatusIndicator.ALL ? 'contained' : 'outlined'
          }
        >
          {StatusIndicator.ALL}
        </Button>
      </Paper>

      <Paper
        elevation={6}
        className={classnames(classes.container)}
        id={StatusIndicator.WAITING}
        onClick={onButtonClick}
      >
        <h4 className={classnames([classes.number, classes.statusWaiting])}>
          {statusCount.waiting}
        </h4>
        <Divider variant='fullWidth' />

        <Button
          className={classes.button}
          color='primary'
          size='sm'
          style={{ height: 28, minWidth: 90 }}
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
      <Paper
        elevation={6}
        className={classnames(classes.container)}
        id={StatusIndicator.DISPENSE}
        onClick={onButtonClick}
      >
        <h4 className={classnames([classes.number, classes.statusDispense])}>
          {statusCount.dispense}
        </h4>
        <Divider variant='fullWidth' />

        <Button
          color='warning'
          size='sm'
          block
          style={{ height: 28, minWidth: 90 }}
          id={StatusIndicator.DISPENSE}
          onClick={onButtonClick}
          variant={
            currentFilter === StatusIndicator.DISPENSE
              ? 'contained'
              : 'outlined'
          }
        >
          {/* currentFilter === StatusIndicator.IN_PROGRESS && <Check /> */}
          {StatusIndicator.DISPENSE}
        </Button>
      </Paper>
      <Paper
        elevation={6}
        className={classnames(classes.container)}
        id={StatusIndicator.BILLING}
        onClick={onButtonClick}
      >
        <h4 className={classnames([classes.number, classes.statusBilling])}>
          {statusCount.billing}
        </h4>
        <Divider variant='fullWidth' />

        <Button
          color='success'
          size='sm'
          block
          style={{ height: 28, minWidth: 90 }}
          id={StatusIndicator.BILLING}
          onClick={onButtonClick}
          variant={
            currentFilter === StatusIndicator.BILLING ? 'contained' : 'outlined'
          }
        >
          {StatusIndicator.BILLING}
        </Button>
      </Paper>
      <Paper
        elevation={6}
        className={classnames(classes.container)}
        id={StatusIndicator.IN_CONS}
        onClick={onButtonClick}
      >
        <h4 className={classnames([classes.number, classes.statusInCons])}>
          {statusCount.inCons}
        </h4>
        <Divider variant='fullWidth' />

        <Button
          size='sm'
          color='danger'
          block
          style={{ height: 28, minWidth: 90 }}
          id={StatusIndicator.IN_CONS}
          onClick={onButtonClick}
          variant={
            currentFilter === StatusIndicator.IN_CONS ? 'contained' : 'outlined'
          }
        >
          {StatusIndicator.IN_CONS}
        </Button>
      </Paper>
      <Paper
        elevation={6}
        className={classnames(classes.container)}
        id={StatusIndicator.UNGRADED}
        onClick={onButtonClick}
      >
        <h4 className={classnames([classes.number, classes.statusUngraded])}>
          {statusCount.ungraded}
        </h4>
        <Divider variant='fullWidth' />

        <Button
          size='sm'
          block
          color='reddit'
          style={{ height: 28, minWidth: 90 }}
          onClick={onButtonClick}
          id={StatusIndicator.UNGRADED}
          variant={
            currentFilter === StatusIndicator.UNGRADED
              ? 'contained'
              : 'outlined'
          }
        >
          {StatusIndicator.UNGRADED}
        </Button>
      </Paper>
      <Paper
        elevation={6}
        className={classnames(classes.container)}
        id={StatusIndicator.COMPLETED}
        onClick={onButtonClick}
      >
        <h4 className={classnames([classes.number, classes.statusCompleted])}>
          {statusCount.completed}
        </h4>
        <Divider variant='fullWidth' />

        <Button
          size='sm'
          block
          style={{ height: 28, minWidth: 90 }}
          onClick={onButtonClick}
          id={StatusIndicator.COMPLETED}
          variant={
            currentFilter === StatusIndicator.COMPLETED
              ? 'contained'
              : 'outlined'
          }
        >
          {StatusIndicator.COMPLETED}
        </Button>
      </Paper>
      {clinicRoleFK === CLINICAL_ROLE.DOCTOR && (
        <Paper
          elevation={6}
          className={classnames(classes.container)}
          id={StatusIndicator.PAST}
          onClick={onButtonClick}
        >
          <h4 className={classnames([classes.number, classes.statusPast])}>
            {statusCount.past}
          </h4>
          <Divider variant='fullWidth' />

          <Button
            size='sm'
            block
            color='linkedin'
            style={{ height: 28, minWidth: 90 }}
            onClick={onButtonClick}
            id={StatusIndicator.PAST}
            variant={
              currentFilter === StatusIndicator.PAST ? 'contained' : 'outlined'
            }
          >
            {StatusIndicator.PAST}
          </Button>
        </Paper>
      )}
      <Paper
        elevation={6}
        className={classnames({
          [classes.container]: true,
          [classes.rightEnd]: true,
        })}
        id={StatusIndicator.APPOINTMENT}
        onClick={onButtonClick}
      >
        <h4 className={classnames([classes.number, classes.statusAll])}>
          {statusCount.appointment}
        </h4>
        <Divider variant='fullWidth' />

        <Button
          color='primary'
          size='sm'
          block
          style={{ height: 28, minWidth: 90 }}
          id={StatusIndicator.APPOINTMENT}
          onClick={onButtonClick}
          variant={
            currentFilter === StatusIndicator.APPOINTMENT
              ? 'contained'
              : 'outlined'
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
