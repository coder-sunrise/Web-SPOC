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
  CodeSelect,
  Danger,
  timeFormat,
  timeFormat24Hour,
} from '@/components'
import { MobileNumberInput } from '@/components/_medisys'

const styles = () => ({
  icon: {
    position: 'relative',
    top: 6,
    marginRight: 15,
  },
  iconRow: {
    marginBottom: 10,
  },
  statusRow: {
    position: 'absolute',
    right: 8,
    top: 8,
    textAlign: 'right',
    color: '#999',
    fontSize: '.75rem',
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

const getDoctorBlockTimeString = (value) => moment(value).format(timeFormat)

const DoctorEventContent = ({ popoverEvent, classes }) => {
  const startTime = getDoctorBlockTimeString(popoverEvent.startDateTime)
  const endTime = getDoctorBlockTimeString(popoverEvent.endDateTime)
  return (
    <GridContainer direction='column'>
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
        <CodeSelect
          disabled
          code='doctorProfile'
          label='Doctor'
          labelField='clinicianProfile.name'
          valueField='clinicianProfile.userProfileFK'
          value={popoverEvent.doctor.clinicianProfile.userProfileFK}
        />
      </GridItem>
      <GridItem>
        <TextField disabled label='Remarks' value={popoverEvent.remarks} />
      </GridItem>
    </GridContainer>
  )
}

class PopoverContent extends React.Component {
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
      doctor,
      // patientName,
      // patientContactNo,
      clinicianFK,
      appointmentTypeFK,
      appointmentStatusFk,
      patientProfile,
    } = popoverEvent

    let { patientName, patientContactNo } = popoverEvent

    // const _contactNo =
    //   patientProfile &&
    //   patientProfile.contactNumbers.find((item) => item.numberTypeFK === 1)

    if (patientProfile) {
      const { name, contactNumbers } = patientProfile
      const _mobileContact = contactNumbers.find(
        (item) => item.numberTypeFK === 1,
      )
      if (_mobileContact) patientContactNo = _mobileContact.number
      patientName = name
      // patientAccountNo = accNo
    }

    // const _patientContactNo = _contactNo ? _contactNo.number : patientContactNo
    return (
      <CardBody>
        <div className={classes.statusRow}>
          <CodeSelect
            code='ltappointmentstatus'
            text
            value={parseInt(appointmentStatusFk, 10)}
          />
        </div>
        {doctor ? (
          <DoctorEventContent {...this.props} />
        ) : (
          <GridContainer direction='column'>
            {hasConflict && (
              <GridItem className={classnames(classes.iconRow)}>
                <ErrorOutline className={classnames(classes.icon)} />
                <Danger style={{ display: 'inline' }}>
                  <span>This appointment has conflict</span>
                </Danger>
              </GridItem>
            )}
            <GridItem className={classnames(classes.iconRow)}>
              {this.getTimeRange()}
            </GridItem>

            <GridItem>
              <TextField disabled label='Patient Name' value={patientName} />
            </GridItem>
            <GridItem>
              {/* <TextField
                disabled
                label='Contact No.'
                value={patientContactNo}
              /> */}
              <MobileNumberInput disabled value={patientContactNo} />
            </GridItem>
            <GridItem md={12}>
              <CodeSelect
                disabled
                code='doctorprofile'
                label='Doctor'
                labelField='clinicianProfile.name'
                valueField='clinicianProfile.id'
                value={clinicianFK}
              />
            </GridItem>
            <GridItem>
              <CodeSelect
                disabled
                code='ctappointmenttype'
                label='Appointment Type'
                labelField='displayValue'
                valueField='id'
                value={appointmentTypeFK}
              />
            </GridItem>
          </GridContainer>
        )}
      </CardBody>
    )
  }
}

export default withStyles(styles, { name: 'PopoverContent' })(PopoverContent)
