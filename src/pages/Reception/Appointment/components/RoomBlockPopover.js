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
})

const getDoctorBlockTimeString = value => moment(value).format(timeFormat24Hour)

const RoomEventContent = ({ popoverEvent, classes }) => {
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
        <TextField
          disabled
          multiline
          rowsMax={10}
          label='Resource'
          value={popoverEvent.room?.resourceName}
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

class RoomBlockPopover extends React.Component {
  render() {
    return (
      <CardBody>
        <RoomEventContent {...this.props} />
      </CardBody>
    )
  }
}

export default withStyles(styles, { name: 'RoomBlockPopover' })(
  RoomBlockPopover,
)
