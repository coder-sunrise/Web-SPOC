import React from 'react'
import classnames from 'classnames'
// moment
import moment from 'moment'
// react-datetime
import Datetime from 'react-datetime'
// big calendar
import BigCalendar from 'react-big-calendar'
// material ui
import { Popover, IconButton, withStyles } from '@material-ui/core'
import { ChevronLeft, ChevronRight } from '@material-ui/icons'
// components
import { Button, CustomDropdown, GridContainer, GridItem } from '@/components'

const styles = () => ({
  dateButton: {
    fontSize: '1.5rem',
    paddingBottom: '8px !important',
  },
})

const CalendarViews = [
  BigCalendar.Views.DAY,
  BigCalendar.Views.WEEK,
  BigCalendar.Views.MONTH,
]

const type = {
  [BigCalendar.Views.DAY]: 'days',
  [BigCalendar.Views.WEEK]: 'weeks',
  [BigCalendar.Views.MONTH]: 'months',
}

const DATE_NAVIGATOR_ACTION = {
  ADD: 'add',
  SUBTRACT: 'subtract',
  BACK_TO_TODAY: 'today',
}

class CalendarToolbar extends React.PureComponent {
  state = {
    showDateOverlay: false,
    anchor: null,
  }

  onDateButtonClick = (event) => {
    this.setState({ showDateOverlay: true, anchor: event.target })
  }

  onDateOverlayClose = () => {
    this.setState({
      showDateOverlay: false,
      anchor: null,
    })
  }

  onDateChange = (newDate) => {
    const { handleDateChange } = this.props
    handleDateChange(newDate.toDate())
  }

  changeDate = (action) => {
    const { handleDateChange } = this.props
    let newDate = moment(new Date())
    const { view: currentView, displayDate: currentDate } = this.props

    if (action === DATE_NAVIGATOR_ACTION.ADD) {
      newDate = moment(currentDate).add(1, type[currentView])
    } else if (action === DATE_NAVIGATOR_ACTION.SUBTRACT) {
      newDate = moment(currentDate).subtract(1, type[currentView])
    }

    handleDateChange(newDate.toDate())
  }

  addDate = () => this.changeDate(DATE_NAVIGATOR_ACTION.ADD)

  subtractDate = () => this.changeDate(DATE_NAVIGATOR_ACTION.SUBTRACT)

  returnToday = () => this.changeDate(DATE_NAVIGATOR_ACTION.BACK_TO_TODAY)

  render () {
    const { classes, label, view, displayDate, handleViewChange } = this.props
    const { showDateOverlay, anchor } = this.state
    return (
      <GridContainer>
        <GridItem xs md={2}>
          <div>
            <IconButton color='primary' onClick={this.subtractDate}>
              <ChevronLeft />
            </IconButton>
            <Button simple color='primary' onClick={this.returnToday}>
              Today
            </Button>
            <IconButton color='primary' onClick={this.addDate}>
              <ChevronRight />
            </IconButton>
          </div>
        </GridItem>
        <GridItem xs md={8} container justify='center'>
          <Button
            block
            simple
            size='lg'
            className={classnames(classes.dateButton)}
            color='primary'
            onClick={this.onDateButtonClick}
          >
            {label}
          </Button>
          <Popover
            id='react-datetime'
            open={showDateOverlay}
            anchorEl={anchor}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
            onClose={this.onDateOverlayClose}
            style={{ width: 500, height: 500 }}
          >
            <Datetime
              onChange={this.onDateChange}
              value={moment(displayDate)}
              dateFormat='YYYY-MM-DD'
              timeFormat={false}
              input={false}
            />
          </Popover>
        </GridItem>
        <GridItem xs md={2} container justify='flex-end'>
          <div>
            <CustomDropdown
              buttonText={view}
              buttonProps={{
                color: 'primary',
                simple: true,
              }}
              onClick={handleViewChange}
              dropdownList={CalendarViews}
            />
          </div>
        </GridItem>
      </GridContainer>
    )
  }
}

export default withStyles(styles)(CalendarToolbar)
