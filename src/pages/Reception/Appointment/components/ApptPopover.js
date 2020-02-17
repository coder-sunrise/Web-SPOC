import React, { Fragment } from 'react'
import { connect } from 'dva'
import moment from 'moment'
// material icon
import { Divider, withStyles } from '@material-ui/core'
import Calendar from '@material-ui/icons/CalendarToday'
// common component
import {
  CodeSelect,
  DatePicker,
  GridContainer,
  GridItem,
  TextField,
} from '@/components'
import * as Helper from './helper'
import { primaryColor } from '@/assets/jss'

const styles = (theme) => ({
  root: {
    width: '500px',
    textAlign: 'left',
    padding: theme.spacing(1),
  },
  appointmentTypeColorBanner: {
    width: '100%',
    height: 20,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  divider: {
    backgroundColor: '#999',
  },
  titleLabel: {
    fontWeight: 500,
  },
  datetimeLabel: {
    display: 'inline-block',
    fontSize: '0.9rem',
  },
  icon: {
    marginRight: theme.spacing(1),
  },
  iconRow: {
    display: 'flex',
    alignItems: 'center',
  },
})

const ApptPopover = ({ classes, popoverEvent, ctappointmenttype = [] }) => {
  const {
    appointment_Resources: appointmentResources,
    appointmentDate,
    appointmentRemarks,
    appointmentTypeFK,
    appointmentStatusFk,
    bookedByUser,
    createDate,
    patientName,
    patientProfile,
    patientContactNo,
    clinicianFK,
    startTime,
    endTime,
  } = popoverEvent

  const date = moment(appointmentDate)
  const title = Helper.constructTitle(
    patientName,
    patientProfile,
    patientContactNo,
  )

  const AppointmentDateLabel = (
    <Fragment>
      <Calendar className={classes.icon} />
      <span className={classes.datetimeLabel}>
        {Helper.parseDateToDay(date)}, {Helper.parseDateToFullDate(date)}
      </span>
    </Fragment>
  )
  const TimeLabel = (
    <Fragment>
      <span className={classes.datetimeLabel}>
        {Helper.getTimeRange(appointmentResources, { startTime, endTime })}
      </span>
    </Fragment>
  )

  const appointmentType = ctappointmenttype.find(
    (item) => item.id === appointmentTypeFK,
  )
  const appointmentColor = appointmentType
    ? appointmentType.tagColorHex
    : primaryColor

  return (
    <div className={classes.root}>
      <div
        className={classes.appointmentTypeColorBanner}
        style={{
          backgroundColor: appointmentColor,
        }}
      />
      <GridContainer style={{ marginTop: 12 }}>
        <GridItem md={12}>
          <h4 className={classes.titleLabel}>{title}</h4>
        </GridItem>
        <GridItem className={classes.iconRow}>{AppointmentDateLabel}</GridItem>
        <GridItem>
          <Divider
            orientation='vertical'
            flexItem
            className={classes.divider}
            style={{ display: 'inline-block', width: 3 }}
          />
        </GridItem>
        <GridItem className={classes.iconRow}>{TimeLabel}</GridItem>
        <GridItem md={12}>
          <Divider
            className={classes.divider}
            style={{ marginTop: 8, marginBottom: 8 }}
          />
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
        <GridItem md={12}>
          <CodeSelect
            disabled
            code='ctappointmenttype'
            label='Appt. Type'
            labelField='displayValue'
            valueField='id'
            value={appointmentTypeFK}
          />
        </GridItem>
        <GridItem md={12}>
          <CodeSelect
            disabled
            code='ltappointmentstatus'
            label='Appt. Status'
            value={appointmentStatusFk && Number(appointmentStatusFk)}
          />
        </GridItem>
        <GridItem md={12}>
          <TextField disabled label='Book By' value={bookedByUser} />
        </GridItem>
        <GridItem md={12}>
          <DatePicker disabled label='Book On' value={createDate} />
        </GridItem>
        <GridItem md={12}>
          <TextField
            disabled
            multiline
            rowsMax={3}
            label='Remarks'
            value={appointmentRemarks}
          />
        </GridItem>
      </GridContainer>
    </div>
  )
}

const Connected = connect(({ codetable }) => ({
  ctappointmenttype: codetable.ctappointmenttype,
}))(ApptPopover)

export default withStyles(styles, { name: 'ApptPopover' })(Connected)
