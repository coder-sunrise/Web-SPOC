import React from 'react'
import classnames from 'classnames'
// material icon
import { withStyles } from '@material-ui/core'
import AccessTime from '@material-ui/icons/AccessTime'
// common component
import { CardBody, GridContainer, GridItem, TextField } from '@/components'

const styles = () => ({
  clockIcon: {
    position: 'relative',
    top: 6,
    marginRight: 15,
  },
  timeRow: {
    marginBottom: 10,
  },
})

const DoctorEventContent = ({ popoverEvent, classes }) => {
  return (
    <GridContainer direction='column' justify='center' alignItems='center'>
      <GridItem className={classnames(classes.timeRow)}>
        <AccessTime className={classnames(classes.clockIcon)} />
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
        <TextField disabled label='Subject' value={popoverEvent.subject} />
      </GridItem>
      <GridItem>
        <TextField
          disabled
          label='Description'
          value={popoverEvent.description}
        />
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
            <GridItem className={classnames(classes.timeRow)}>
              <AccessTime className={classnames(classes.clockIcon)} />
              <span>
                {popoverEvent.startTime} - {popoverEvent.endTime}
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
