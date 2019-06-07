import React from 'react'
// moment
import moment from 'moment'
// big calendar
import BigCalendar from 'react-big-calendar'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
// material ui
import { withStyles } from '@material-ui/core'
// setting
import { defaultColorOpts, AppointmentTypeAsColor } from '../setting'

const DragAndDropCalendar = withDragAndDrop(BigCalendar)
const localizer = BigCalendar.momentLocalizer(moment)

const styles = () => ({
  defaultColor: {
    background: defaultColorOpts.value,
    '&:hover': {
      backgroundColor: defaultColorOpts.activeColor,
    },
  },
  ...AppointmentTypeAsColor,
})

class CalendarView extends React.PureComponent {
  eventColors = (event) => {
    // eventPropGetters = (event, start ,end, isSelected) => {}

    const { classes } = this.props
    const bg = 'background-'
    const hover = 'hover-'
    const eventClassName = event.color
      ? [
          classes[`${bg}${event.color}`],
          classes[`${hover}${event.color}`],
        ].join(' ')
      : classes.defaultColor

    return {
      className: eventClassName,
    }
  }

  render () {
    const {
      // --- event handlers ---
      handleMoveEvent,
      handleNewEvent,
      handleJumpToDate,
      handleViewChange,
      handleSelectEvent,
      handleDoubleClick,
      // --- variables ---
      displayDate,
      minDate,
      maxDate,
      calendarEvents,
      calendarView,
      resources,
    } = this.props

    return (
      <DragAndDropCalendar
        // components={{
        //   toolbar: this.Toolbar,
        //   event: Event,
        // }}
        // --- values props ---
        localizer={localizer}
        date={displayDate}
        min={minDate}
        max={maxDate}
        events={calendarEvents}
        view={calendarView}
        // step={15}
        // --- values props ---
        // --- functional props ---
        selectable
        resizable={false}
        // --- functional props ---
        // --- resources ---
        resources={resources}
        resourceIdAccessor='resourceId'
        resourceTitleAccessor='resourceTitle'
        // --- resources ---
        // --- event handlers ---
        onEventDrop={handleMoveEvent}
        onSelectSlot={handleNewEvent}
        onNavigate={handleJumpToDate}
        onView={handleViewChange}
        onSelectEvent={handleSelectEvent}
        onDoubleClickEvent={handleDoubleClick}
        eventPropGetter={this.eventColors}
        // onDragStart={console.log}
        // --- event handlers ---
      />
    )
  }
}

export default withStyles(styles, { name: 'CalendarView' })(CalendarView)
