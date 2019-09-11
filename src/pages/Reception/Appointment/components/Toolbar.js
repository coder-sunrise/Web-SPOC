import React from 'react'
import classnames from 'classnames'
// moment
import moment from 'moment'
// react-datetime
import Datetime from 'react-datetime'
import { DatePicker, Calendar } from 'antd'
// big calendar
import BigCalendar from 'react-big-calendar'
// material ui
import { Popover, IconButton, withStyles } from '@material-ui/core'
import { ChevronLeft, ChevronRight } from '@material-ui/icons'
// components
import { Button, GridContainer, GridItem } from '@/components'

const styles = () => ({
  btnContainer: {
    display: 'flex',
    '& button': {
      marginRight: '0px',
    },
  },

  container: {
    marginBottom: 15,
  },
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
    this.onDateOverlayClose()
    handleDateChange(newDate.toDate())
  }

  changeDate = (action) => {
    const { handleDateChange } = this.props
    let newDate = moment(new Date())
    const { view: currentView, date: currentDate } = this.props

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

  handleClick = (event) => {
    const { currentTarget } = event
    const { handleViewChange } = this.props
    currentTarget && handleViewChange(currentTarget.id)
  }

  render () {
    const { classes, label, view, displayDate } = this.props
    const { showDateOverlay, anchor } = this.state

    return (
      <GridContainer className={classnames(classes.container)}>
        <GridItem xs md={2}>
          <div>
            <Button justIcon simple color='info' onClick={this.subtractDate}>
              <ChevronLeft />
            </Button>
            <Button simple color='info' onClick={this.returnToday}>
              Today
            </Button>
            <Button justIcon simple color='info' onClick={this.addDate}>
              <ChevronRight />
            </Button>
          </div>
        </GridItem>
        <GridItem xs md={8} container justify='center'>
          <Button
            block
            simple
            size='lg'
            className={classnames(classes.dateButton)}
            color='info'
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
            transformOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
            onClose={this.onDateOverlayClose}
            // style={{ width: 500, height: 500 }}
          >
            <div style={{ width: 400, height: '100%' }}>
              <Calendar
                fullscreen={false}
                defaultValue={moment(displayDate)}
                onSelect={this.onDateChange}
              />
            </div>
          </Popover>
        </GridItem>
        <GridItem xs md={2} container justify='flex-end'>
          <div className={classnames(classes.btnContainer)}>
            {CalendarViews.map((cv) => (
              <Button
                simple={view !== cv}
                color='info'
                id={cv}
                onClick={this.handleClick}
              >
                {cv}
              </Button>
            ))}
          </div>
        </GridItem>
      </GridContainer>
    )
  }
}

export default withStyles(styles)(CalendarToolbar)
