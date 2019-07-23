import React from 'react'
// moment
import moment from 'moment'
// big calendar
import BigCalendar from 'react-big-calendar'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
// material ui
import { withStyles } from '@material-ui/core'
// setting
import {
  defaultColorOpts,
  doctorEventColorOpts,
  AppointmentTypeAsColor,
} from '../setting'
// sub component
import CalendarToolbar from './Toolbar'
import Event from './Event'

const DragAndDropCalendar = withDragAndDrop(BigCalendar)
const localizer = BigCalendar.momentLocalizer(moment)

const styles = () => ({
  defaultColor: {
    background: defaultColorOpts.value,
    '&:hover': {
      backgroundColor: defaultColorOpts.activeColor,
    },
  },
  doctorEvent: {
    background: doctorEventColorOpts.value,
    '&:hover': {
      backgroundColor: doctorEventColorOpts.activeColor,
    },
  },
  calendarHolidayLabel: {
    paddingLeft: 4,
    float: 'left',
    textAlign: 'left',
    maxWidth: '75%',
    fontSize: '0.9rem',
    fontWeight: '450',
    color: '#6f6f6f',
  },
  ...AppointmentTypeAsColor,
})

const today = new Date()

class CalendarView extends React.PureComponent {
  state = {
    displayDate: new Date(),
    calendarView: BigCalendar.Views.MONTH,
    minTime: new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      7,
      0,
      0,
    ),
    maxTime: new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      19,
      0,
      0,
    ),
  }

  _eventColors = (event) => {
    // eventPropGetters = (event, start ,end, isSelected) => {}
    const { classes } = this.props
    const bg = 'background-'
    const hover = 'hover-'
    if (event.isDoctorEvent) {
      return { className: classes.doctorEvent }
    }
    const eventClassName = event.appointmentType
      ? [
          classes[`${bg}${event.appointmentType}`],
          classes[`${hover}${event.appointmentType}`],
        ].join(' ')
      : classes.defaultColor

    return {
      className: eventClassName,
    }
  }

  _customSlotPropGetter = (date) => {
    const { calendarView } = this.state
    if (
      calendarView === BigCalendar.Views.MONTH &&
      (date.getDate() === 7 ||
        date.getDate() === 17 ||
        date.getDate() === 19 ||
        date.getDate() === 28)
    )
      return {
        className: 'calendar-holiday',
        style: {
          '&::before': {
            content: 'test 123',
          },
        },
      }
    return {}
  }

  _jumpToDate = (date) => {
    this.setState({ displayDate: date })
  }

  _onViewChange = (view) => {
    this.setState({ calendarView: view })
  }

  _moveEvent = ({ event, start, end, resourceId }) => {
    const { handleMoveEvent } = this.props
    const { id, _appointmentID } = event

    const resourceID = resourceId !== undefined ? resourceId : event.resourceId

    const updatedEvent = {
      start,
      end,
      resourceId: resourceID,
    }

    handleMoveEvent({ updatedEvent, id, _appointmentID })
  }

  Toolbar = (toolbarProps) => {
    return (
      <CalendarToolbar
        {...toolbarProps}
        displayDate={this.state.displayDate}
        handleViewChange={this._onViewChange}
        handleDateChange={this._jumpToDate}
      />
    )
  }

  Event = (eventProps) => {
    const { handleEventMouseOver } = this.props
    return <Event {...eventProps} handleMouseOver={handleEventMouseOver} />
  }

  MonthDateHeader = ({
    date,
    onDrillDown,
    label,
    // ***unused props provided by dependencies***
    // drillDownView,
    // isOffRange,
  }) => {
    const { classes } = this.props
    let holidayLabel = ''
    if (
      date.getDate() === 7 ||
      date.getDate() === 17 ||
      date.getDate() === 19 ||
      date.getDate() === 28
    ) {
      holidayLabel = 'Public Holiday'
    }
    return (
      <div>
        <span className={classes.calendarHolidayLabel}>{holidayLabel}</span>
        <a onClick={onDrillDown}>{label}</a>
      </div>
    )
  }

  render () {
    const {
      // --- event handlers ---
      handleSelectSlot,
      handleSelectEvent,
      handleDoubleClick,
      handleOnDragStart,
      // --- variables ---
      calendarEvents,
      resources,
    } = this.props

    const { displayDate, minTime, maxTime, calendarView } = this.state

    return (
      <DragAndDropCalendar
        components={{
          // https://github.com/intljusticemission/react-big-calendar/blob/master/src/Calendar.js
          toolbar: this.Toolbar,
          event: this.Event,
          month: {
            dateHeader: this.MonthDateHeader,
          },
        }}
        localizer={localizer}
        date={displayDate}
        min={minTime}
        max={maxTime}
        view={calendarView}
        // --- values props ---
        events={calendarEvents}
        // --- values props ---
        // --- functional props ---
        selectable='ignoreEvents'
        resizable={false}
        showMultiDayTimes={false}
        step={15}
        timeslots={2}
        longPressThreshold={500}
        tooltipAccessor={null}
        // --- functional props ---
        // --- resources ---
        resources={resources}
        resourceIdAccessor='doctorProfileFK'
        resourceTitleAccessor='doctorName'
        // --- resources ---
        // --- event handlers ---
        onNavigate={this._jumpToDate}
        onEventDrop={this._moveEvent}
        onView={this._onViewChange}
        eventPropGetter={this._eventColors}
        dayPropGetter={this._customSlotPropGetter}
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
        onDoubleClickEvent={handleDoubleClick}
        onDragStart={handleOnDragStart}
        // --- event handlers ---
      />
    )
  }
}

export default withStyles(styles, { name: 'CalendarView' })(CalendarView)
