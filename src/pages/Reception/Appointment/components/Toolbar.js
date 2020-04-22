import React, { Fragment } from 'react'
import classnames from 'classnames'
import { connect } from 'dva'
// moment
import moment from 'moment'
// react-datetime
import { Calendar } from 'antd'
// big calendar
import BigCalendar from 'react-big-calendar'
// material ui
import {
  Popover,
  withStyles,
  Popper,
  Paper,
  Grow,
  ClickAwayListener,
} from '@material-ui/core'
import ArrowLeft from '@material-ui/icons/ArrowLeft'
import ArrowRight from '@material-ui/icons/ArrowRight'
import ArrowDropDown from '@material-ui/icons/ArrowDropDown'
import { getUniqueId } from '@/utils/utils'

// components
import { Button, GridContainer, GridItem, Tooltip } from '@/components'

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

  listItem: {
    padding: 3,
    transition: '0.3s',
    '&:hover': {
      backgroundColor: '#14bace',
      color: 'white',
    },
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

@connect(({ calendar }) => ({
  displayDate: calendar.currentViewDate,
}))
class CalendarToolbar extends React.PureComponent {
  state = {
    showDateOverlay: false,
    anchor: null,
    showNextModal: false,
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

  handleNextModal = () => {
    this.setState((prevState) => {
      return {
        showNextModal: !prevState.showNextModal,
      }
    })
  }

  handleModalValueClick = (index, renderType) => {
    const { handleSelectedValue, displayDate } = this.props
    handleSelectedValue(index, renderType, displayDate)
    this.handleNextModal()
  }

  renderColumn = (header, renderType) => {
    return (
      <div style={{ margin: 0 }}>
        <b>{header}</b>
        <ul
          style={{
            listStyle: 'none',
            padding: 0,
            cursor: 'pointer',
            marginTop: 10,
          }}
        >
          {this.renderList(1, 7, renderType)}
        </ul>
      </div>
    )
  }

  renderList = (startIndex, endIndex, renderType) => {
    const { classes } = this.props
    let elements = []

    for (let index = startIndex; index <= endIndex; index++) {
      const element = (
        <li
          id={getUniqueId()}
          className={classes.listItem}
          onClick={() => {
            this.handleModalValueClick(index, renderType)
          }}
        >
          {index}
        </li>
      )
      elements = [
        ...elements,
        element,
      ]
    }
    return elements
  }

  render () {
    const { classes, label, view, displayDate } = this.props
    const { showDateOverlay, anchor, showNextModal } = this.state

    return (
      <Fragment>
        <GridContainer className={classnames(classes.container)}>
          <GridItem xs md={3}>
            <Tooltip title='Jump to today' placement='bottom'>
              <Button color='info' onClick={this.returnToday} authority='none'>
                Today
              </Button>
            </Tooltip>
            <Tooltip title='Jump to next Day/Month/Year' placement='bottom'>
              <Button
                color='info'
                onClick={this.handleNextModal}
                authority='none'
                buttonRef={(node) => {
                  this.anchorElAccount = node
                }}
              >
                Next
                <ArrowDropDown style={{ margin: 0, marginLeft: 5 }} />
              </Button>
            </Tooltip>
          </GridItem>
          <GridItem xs md={6} container justify='center'>
            <Tooltip title={`Previous ${view}`}>
              <Button
                justIcon
                color='info'
                authority='none'
                onClick={this.subtractDate}
              >
                <ArrowLeft />
              </Button>
            </Tooltip>
            <Button
              color='info'
              size='lg'
              authority='none'
              className={classnames(classes.dateButton)}
              onClick={this.onDateButtonClick}
            >
              {label}
            </Button>
            <Tooltip title={`Next ${view}`}>
              <Button
                justIcon
                color='info'
                authority='none'
                onClick={this.addDate}
              >
                <ArrowRight />
              </Button>
            </Tooltip>
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
          <GridItem xs md={3} container justify='flex-end'>
            <div className={classnames(classes.btnContainer)}>
              {CalendarViews.map((cv) => (
                <Button
                  simple={view !== cv}
                  color='info'
                  id={cv}
                  onClick={this.handleClick}
                  authority='none'
                >
                  {cv}
                </Button>
              ))}
            </div>
          </GridItem>
        </GridContainer>
        <Popper
          open={showNextModal}
          anchorEl={this.anchorElAccount}
          transition
          disablePortal
          placement='bottom-end'
          style={{
            zIndex: 999,
            left: '200px !important',
            width: 300,
            marginLeft: 80,
          }}
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              id='menu-list'
              style={{ transformOrigin: '0 0 -30' }}
            >
              <Paper className={classes.dropdown}>
                <ClickAwayListener onClickAway={this.handleNextModal}>
                  <div style={{ padding: 10, fontSize: '0.9vw' }}>
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gridGap: 20,
                        textAlign: 'center',
                      }}
                    >
                      {this.renderColumn('Day', 'days')}
                      {this.renderColumn('Month', 'months')}
                      {this.renderColumn('Year', 'years')}
                    </div>
                  </div>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </Fragment>
    )
  }
}

export default withStyles(styles)(CalendarToolbar)
