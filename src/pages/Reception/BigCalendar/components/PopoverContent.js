import React, { Fragment } from 'react'
import classnames from 'classnames'
import moment from 'moment'
// material icon
import { withStyles } from '@material-ui/core'
import AccessTime from '@material-ui/icons/AccessTime'
import ErrorOutline from '@material-ui/icons/ErrorOutline'
// big calendar
import BigCalendar from 'react-big-calendar'
// common component
import {
  CardBody,
  GridContainer,
  GridItem,
  TextField,
  Danger,
  timeFormat,
  timeFormat24Hour,
} from '@/components'

const styles = () => ({
  icon: {
    position: 'relative',
    top: 6,
    marginRight: 15,
  },
  iconRow: {
    marginBottom: 10,
  },
})

const getTimeString = (value) => {
  if (moment(value, timeFormat).isValid()) {
    return moment(value, timeFormat).format(timeFormat)
  }
  if (moment(value, timeFormat24Hour).isValid()) {
    return moment(value, timeFormat24Hour).format(timeFormat24Hour)
  }
  return 'N/A'
}

const DoctorEventContent = ({ popoverEvent, classes }) => {
  const startTime = getTimeString(popoverEvent.start)
  const endTime = getTimeString(popoverEvent.end)
  return (
    <GridContainer direction='column' justify='center' alignItems='center'>
      {popoverEvent.hasConflict && (
        <GridItem className={classnames(classes.iconRow)}>
          <ErrorOutline className={classnames(classes.icon)} />
          <Danger style={{ display: 'inline' }}>
            <span>This appointment has conflict</span>
          </Danger>
        </GridItem>
      )}
      <GridItem className={classnames(classes.iconRow)}>
        <AccessTime className={classnames(classes.icon)} />
        <span>
          {startTime} - {endTime}
        </span>
      </GridItem>
      <GridItem>
        <TextField disabled label='Doctor' value={popoverEvent.doctor} />
      </GridItem>
      <GridItem>
        <TextField disabled label='Event Type' value={popoverEvent.eventType} />
      </GridItem>
      <GridItem>
        <TextField disabled label='Remarks' value={popoverEvent.remarks} />
      </GridItem>
    </GridContainer>
  )
}

class PopoverContent extends React.PureComponent {
  getTimeRange = () => {
    const { classes, popoverEvent, calendarView } = this.props
    if (calendarView === BigCalendar.Views.MONTH) return ''

    return (
      <Fragment>
        <AccessTime className={classnames(classes.icon)} />
        <span>
          {getTimeString(popoverEvent.startTime)} -&nbsp;
          {getTimeString(popoverEvent.endTime)}
        </span>
      </Fragment>
    )
  }

  render () {
    const { popoverEvent, classes } = this.props
    const {
      hasConflict,
      isDoctorEvent,
      patientName,
      patientContactNo,
      doctor,
      appointmentType,
      appointmentStatusFk,
    } = popoverEvent

    return (
      <CardBody>
        {isDoctorEvent ? (
          <DoctorEventContent {...this.props} />
        ) : (
          <GridContainer
            direction='column'
            justify='center'
            alignItems='center'
          >
            {hasConflict && (
              <GridItem className={classnames(classes.iconRow)}>
                <ErrorOutline className={classnames(classes.icon)} />
                <Danger style={{ display: 'inline' }}>
                  <span>This appointment has conflict</span>
                </Danger>
              </GridItem>
            )}
            <GridItem>
              {appointmentStatusFk === '2' && (
                <span style={{ textAlign: 'right' }}>DRAFT</span>
              )}
            </GridItem>
            <GridItem className={classnames(classes.iconRow)}>
              {this.getTimeRange()}
            </GridItem>

            <GridItem>
              <TextField disabled label='Patient Name' value={patientName} />
            </GridItem>
            <GridItem>
              <TextField
                disabled
                label='Contact No.'
                value={patientContactNo}
              />
            </GridItem>
            <GridItem>
              <TextField disabled label='Doctor' value={doctor} />
            </GridItem>
            <GridItem>
              <TextField
                disabled
                label='Appointment Type'
                value={appointmentType}
              />
            </GridItem>
          </GridContainer>
        )}
      </CardBody>
    )
  }
}

export default withStyles(styles, { name: 'PopoverContent' })(PopoverContent)
