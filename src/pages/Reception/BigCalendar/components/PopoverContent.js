import React from 'react'
import classnames from 'classnames'
import moment from 'moment'
// material icon
import { withStyles } from '@material-ui/core'
import AccessTime from '@material-ui/icons/AccessTime'
import ErrorOutline from '@material-ui/icons/ErrorOutline'
// common component
import {
  CardBody,
  GridContainer,
  GridItem,
  TextField,
  Danger,
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
  const timeFormat = 'hh:mm a'
  return moment(value).isValid() ? moment(value).format(timeFormat) : 'N/A'
}

const DoctorEventContent = ({ popoverEvent, classes }) => {
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
          {popoverEvent.startTime} - {popoverEvent.endTime}
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
  render () {
    const { popoverEvent, classes } = this.props
    return (
      <CardBody>
        {popoverEvent.isDoctorEvent ? (
          <DoctorEventContent {...this.props} />
        ) : (
          <GridContainer
            direction='column'
            justify='center'
            alignItems='center'
          >
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
                {getTimeString(popoverEvent.timeFrom)} -{' '}
                {getTimeString(popoverEvent.timeTo)}
              </span>
            </GridItem>

            <GridItem>
              <TextField
                disabled
                label='Patient Name'
                value={popoverEvent.patientName}
              />
            </GridItem>
            <GridItem>
              <TextField
                disabled
                label='Contact No.'
                value={popoverEvent.contactNo}
              />
            </GridItem>
            <GridItem>
              <TextField disabled label='Doctor' value={popoverEvent.doctor} />
            </GridItem>
            <GridItem>
              <TextField
                disabled
                label='Appointment Type'
                value={popoverEvent.appointmentType}
              />
            </GridItem>
          </GridContainer>
        )}
      </CardBody>
    )
  }
}

export default withStyles(styles, { name: 'PopoverContent' })(PopoverContent)
