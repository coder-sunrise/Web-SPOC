import React, { Fragment } from 'react'
import moment from 'moment'
import classnames from 'classnames'
// material icon
import { withStyles } from '@material-ui/core'
import AccessTime from '@material-ui/icons/AccessTime'
// big calendar
import BigCalendar from 'react-big-calendar'
// common component
import {
  CardContainer,
  GridContainer,
  GridItem,
  timeFormat,
  timeFormat24Hour,
} from '@/components'

const styles = (theme) => ({
  root: {
    width: '250px',
    textAlign: 'left',
    padding: theme.spacing(1),
  },
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

const ApptPopover = ({ classes, popoverEvent, calendarView }) => {
  const getTimeRange = () => {
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

  return (
    <CardContainer hideHeader className={classes.root}>
      <div />
      <GridContainer>
        <GridItem md={12}>
          <h4>Patient name</h4>
        </GridItem>
      </GridContainer>
    </CardContainer>
  )
}

export default withStyles(styles, { name: 'ApptPopover' })(ApptPopover)
