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

  _jumpToDate = (date) => {
    this.setState({ displayDate: date })
  }

  _onViewChange = (view) => {
    this.setState({ calendarView: view })
  }

  _moveEvent = ({
    event,
    start,
    end,
    resourceId,
    isAllDay: droppedOnAllDaySlot,
  }) => {
    const { calendarEvents: events, handleMoveEvent } = this.props

    const idx = events.indexOf(event)
    let { allDay } = event

    if (!event.allDay && droppedOnAllDaySlot) {
      allDay = true
    } else if (event.allDay && !droppedOnAllDaySlot) {
      allDay = false
    }

    const resourceID = resourceId !== undefined ? resourceId : event.resourceId
    const updatedEvent = {
      ...event,
      start,
      end,
      resourceId: resourceID,
      allDay,
    }

    const nextEvents = [
      ...events,
    ]
    nextEvents.splice(idx, 1, updatedEvent)

    handleMoveEvent(nextEvents)
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
          toolbar: this.Toolbar,
          event: this.Event,
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
        step={15}
        timeslots={2}
        longPressThreshold={500}
        tooltipAccessor={null}
        // --- functional props ---
        // --- resources ---
        resources={resources}
        resourceIdAccessor='roomNo'
        resourceTitleAccessor='roomTitle'
        // --- resources ---
        // --- event handlers ---
        onNavigate={this._jumpToDate}
        onEventDrop={this._moveEvent}
        onView={this._onViewChange}
        eventPropGetter={this._eventColors}
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
