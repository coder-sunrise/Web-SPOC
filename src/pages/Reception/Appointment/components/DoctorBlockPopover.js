import React, { Fragment } from 'react'
import classnames from 'classnames'
import moment from 'moment'
// material icon
import { withStyles } from '@material-ui/core'
import AccessTime from '@material-ui/icons/AccessTime'
import ErrorOutline from '@material-ui/icons/ErrorOutline'
import * as Helper from './helper'
// common component
import {
  CardBody,
  GridContainer,
  GridItem,
  TextField,
  CodeSelect,
  Danger,
  timeFormat24Hour,
} from '@/components'
import { CALENDAR_VIEWS } from '@/utils/constants'

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

const getDoctorBlockTimeString = value => moment(value).format(timeFormat24Hour)

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
        <TextField
          disabled
          multiline
          rowsMax={10}
          label='Remarks'
          value={popoverEvent.remarks}
        />
      </GridItem>
    </GridContainer>
  )
}

class DoctorBlockPopover extends React.Component {
  getTimeRange = () => {
    const { classes, popoverEvent, calendarView } = this.props
    if (calendarView === CALENDAR_VIEWS.MONTH) return ''

    return (
      <Fragment>
        <AccessTime className={classnames(classes.icon)} />
        <span>
          {Helper.getTimeString(popoverEvent.startTime)} -&nbsp;
          {Helper.getTimeString(popoverEvent.endTime)}
        </span>
      </Fragment>
    )
  }

  render() {
    const { popoverEvent, classes } = this.props
    const { appointmentStatusFk } = popoverEvent

    return (
      <CardBody>
        <div className={classes.statusRow}>
          <CodeSelect
            code='ltappointmentstatus'
            text
            value={parseInt(appointmentStatusFk, 10)}
          />
        </div>
        <DoctorEventContent {...this.props} />
      </CardBody>
    )
  }
}

export default withStyles(styles, { name: 'DoctorBlockPopover' })(
  DoctorBlockPopover,
)
