import React from 'react'
import { connect } from 'dva'
// moment
import moment from 'moment'
// big calendar
import BigCalendar from 'react-big-calendar'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
// import 'react-big-calendar/lib/sass/styles.scss'
// import 'react-big-calendar/lib/addons/dragAndDrop/styles.scss'
// material ui
import { withStyles } from '@material-ui/core'
// components
import { serverDateFormat } from '@/components'
// medisys components
import { LoadingWrapper } from '@/components/_medisys'
// setting
import { doctorEventColorOpts } from '../utils'
// sub component
import CalendarToolbar from './Toolbar'
import Event from './Event'
import { getFirstAppointmentType } from './form/formUtils'
// assets
import { primaryColor } from '@/assets/jss'

const DragAndDropCalendar = withDragAndDrop(BigCalendar)
const localizer = BigCalendar.momentLocalizer(moment)

const styles = () => ({
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
})

const today = new Date()

const applyFilter = (filter, data) => {
  const { filterByApptType, filterByDoctor, search = '' } = filter
  let returnData = [
    ...data,
  ]
  try {
    // filter by patient name
    if (search !== '') {
      returnData = returnData.filter(
        (eachData) =>
          eachData.patientName.toLowerCase().indexOf(search.toLowerCase()) !==
          -1,
      )
    }

    // filter by doctor
    if (filterByDoctor.length > 0) {
      returnData = returnData.filter((eachData) =>
        filterByDoctor.includes(eachData.clinicianFK),
      )
    }

    // filter by appointment type
    if (filterByApptType.length > 0) {
      returnData = returnData.filter((eachData) =>
        filterByApptType.includes(eachData.appointmentTypeFK),
      )
    }
  } catch (error) {
    console.log({ error })
  }

  return returnData
}

@connect(({ calendar, codetable, doctorBlock, loading }) => ({
  displayDate: calendar.currentViewDate,
  calendarView: calendar.calendarView,
  calendarEvents: calendar.list,
  publicHolidays: calendar.publicHolidayList,
  doctorBlocks: doctorBlock.list,
  appointmentTypes: codetable.ctappointmenttype || [],
  loading: loading.effects['calendar/getCalendarList'],
}))
class CalendarView extends React.PureComponent {
  state = {
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
    const { calendarView, appointmentTypes } = this.props
    let appointmentType
    if (calendarView !== BigCalendar.Views.MONTH) {
      appointmentType = appointmentTypes.find(
        (item) => item.id === event.appointmentTypeFK,
      )
    } else {
      const appointmentTypeFK = getFirstAppointmentType(event)
      appointmentType =
        appointmentTypeFK !== null &&
        appointmentTypes.find((item) => item.id === appointmentTypeFK)
    }

    return {
      style: {
        backgroundColor: !appointmentType
          ? primaryColor
          : appointmentType.tagColorHex,
      },
    }
  }

  _customDayPropGetter = (date) => {
    const { publicHolidays } = this.props
    const momentDate = moment(date)
    const publicHoliday = publicHolidays.find((item) => {
      const momentStartDate = moment(item.startDate)

      if (momentStartDate.diff(momentDate, 'day') === 0) {
        return true
      }
      return false
    })

    if (this.props.calendarView === BigCalendar.Views.MONTH && publicHoliday)
      return {
        className: 'calendar-holiday',
      }
    return {}
  }

  _jumpToDate = (date) => {
    this.props.dispatch({
      type: 'calendar/navigateCalendar',
      payload: { date },
    })
    // this.props.dispatch({ type: 'calendar/setCurrentViewDate', date })
  }

  _onViewChange = (view) => {
    this.props.dispatch({
      type: 'calendar/navigateCalendar',
      payload: { view },
    })
    this.props.dispatch({
      type: 'calendar/setCalendarView',
      payload: view,
    })
  }

  _moveEvent = ({ event, start, end, resourceId }) => {
    console.log({ event, start, end, resourceId })
    // const { handleMoveEvent } = this.props
    // const { id, _appointmentID } = event

    // const resourceID = resourceId !== undefined ? resourceId : event.resourceId

    // const updatedEvent = {
    //   start,
    //   end,
    //   resourceId: resourceID,
    // }
    // handleMoveEvent({ updatedEvent, id, _appointmentID })
  }

  Toolbar = (toolbarProps) => {
    return (
      <CalendarToolbar
        {...toolbarProps}
        displayDate={this.props.displayDate}
        handleViewChange={this._onViewChange}
        handleDateChange={this._jumpToDate}
      />
    )
  }

  Event = (eventProps) => {
    const { handleEventMouseOver, calendarView } = this.props

    return (
      <Event
        {...eventProps}
        calendarView={calendarView}
        handleMouseOver={handleEventMouseOver}
      />
    )
  }

  MonthDateHeader = ({
    date,
    onDrillDown,
    label,
    // ***unused props provided by dependencies***
    // drillDownView,
    // isOffRange,
  }) => {
    const { classes, publicHolidays } = this.props
    let holidayLabel = ''
    const momentDate = moment(date)
    const publicHoliday = publicHolidays.find((item) => {
      const momentStartDate = moment(item.startDate)

      if (momentStartDate.diff(momentDate, 'day') === 0) {
        return true
      }
      return false
    })

    if (publicHoliday) holidayLabel = publicHoliday.displayValue
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
      doctorBlocks,
      resources,
      displayDate,
      calendarView,
      filter,
      loading,
    } = this.props
    // console.log({ filter, resources })
    const flattenedList =
      calendarView === BigCalendar.Views.MONTH
        ? calendarEvents.reduce((events, appointment) => {
            const { appointment_Resources: apptResources = [] } = appointment

            const firstApptRes = apptResources.find(
              (item) => item.sortOrder === 0,
            )

            const firstClinicianFK =
              firstApptRes !== undefined ? firstApptRes.clinicianFK : undefined

            const firstAppointmentTypeFK =
              firstApptRes !== undefined
                ? firstApptRes.appointmentTypeFK
                : undefined

            return [
              ...events,
              {
                ...appointment,
                start: appointment.appointmentDate,
                end: appointment.appointmentDate,
                appointmentTypeFK: firstAppointmentTypeFK,
                clinicianFK: firstClinicianFK,
              },
            ]
          }, [])
        : calendarEvents.reduce((events, appointment) => {
            const {
              appointmentDate,
              patientName,
              patientContactNo,
              isEnableRecurrence,
              appointment_Resources: apptResources,
            } = appointment

            const apptEvents = apptResources.map((item) => ({
              ...item,
              resourceId: item.clinicianFK,
              clinicianFK: item.clinicianFK,
              patientName,
              patientContactNo,
              isEnableRecurrence,
              start: moment(
                `${appointmentDate} ${item.startTime}`,
                `${serverDateFormat} HH:mm`,
              ).toDate(),
              end: moment(
                `${appointmentDate} ${item.endTime}`,
                `${serverDateFormat} HH:mm`,
              ).toDate(),
            }))

            return [
              ...events,
              ...apptEvents,
            ]
          }, [])

    const { minTime, maxTime } = this.state
    const filtered = applyFilter(filter, [
      ...flattenedList,
      // ...doctorBlocks.map((item) => ({
      //   ...item,
      //   start: item.startDateTime,
      //   end: item.endDateTime,
      // })),
    ])

    console.log({ filtered })

    return (
      <LoadingWrapper loading={loading} text='Loading appointments...'>
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
          events={filtered}
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
          resourceIdAccessor='clinicianFK'
          resourceTitleAccessor='doctorName'
          // --- resources ---
          // --- event handlers ---
          onNavigate={this._jumpToDate}
          onEventDrop={this._moveEvent}
          onView={this._onViewChange}
          eventPropGetter={this._eventColors}
          dayPropGetter={this._customDayPropGetter}
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
          onDoubleClickEvent={handleDoubleClick}
          onDragStart={handleOnDragStart}
          // --- event handlers ---
        />
      </LoadingWrapper>
    )
  }
}

export default withStyles(styles, { name: 'CalendarView' })(CalendarView)
