import React from 'react'
import { connect } from 'dva'
// material ui
import { Popover, withStyles } from '@material-ui/core'
// common component
import { CardContainer, CommonModal } from '@/components'
// sub component
import FilterBar from './components/FilterBar'
import CalendarView from './components/CalendarView'
import PopoverContent from './components/PopoverContent'
import Form from './components/form/Form'
import DoctorBlockForm from './components/form/DoctorBlock'
// settings
import { defaultColorOpts, AppointmentTypeAsColor } from './setting'
import { CalendarActions } from './const'
import { getUniqueGUID } from '@/utils/utils'

const styles = (theme) => ({
  popover: {
    pointerEvents: 'none',
  },
  typography: {
    padding: theme.spacing.unit,
  },
  dateButton: {
    // marginTop: theme.spacing.unit,
    fontSize: '1.5rem',
    paddingBottom: '8px !important',
  },
  defaultColor: {
    background: defaultColorOpts.value,
    '&:hover': {
      backgroundColor: defaultColorOpts.activeColor,
    },
  },
  ...AppointmentTypeAsColor,
})

const InitialPopoverEvent = {
  startTime: '',
  endTime: '',
  patientName: '',
  contactNo: '',
}

const applyFilter = (data, filter) => {
  let returnData = [
    ...data,
  ]

  // filter by doctor
  const { doctors } = filter
  if (doctors.length !== 0 && !doctors.includes('all'))
    returnData = returnData.filter((aptData) =>
      doctors.includes(aptData.doctor),
    )

  // filter by appointment type
  const { appointmentType } = filter
  if (appointmentType.length !== 0 && !appointmentType.includes('all')) {
    returnData = returnData.filter((aptData) =>
      appointmentType.includes(aptData.appointmentType),
    )
  }
  // filter by query
  const { searchQuery } = filter
  if (searchQuery !== '') {
    returnData = returnData.filter((aptData) => {
      const { patientName } = aptData
      if (patientName.toLowerCase().includes(searchQuery.toLowerCase()))
        return true

      return false
    })
  }

  return returnData
}

@connect(({ calendar }) => ({ calendar }))
class Appointment extends React.PureComponent {
  state = {
    showPopup: false,
    showAppointmentForm: false,
    showDoctorEventModal: false,
    popupAnchor: null,
    popoverEvent: { ...InitialPopoverEvent },
    resources: [
      { doctorProfileFK: '0', doctorName: 'Medisys' },
      { doctorProfileFK: '1', doctorName: 'Levinne' },
      { doctorProfileFK: '2', doctorName: 'Cheah' },
      { doctorProfileFK: '3', doctorName: 'Tan' },
      { doctorProfileFK: '4', doctorName: 'Other' },
    ],
    // calendarEvents: dndEvents,
    selectedSlot: {},
    filter: {
      searchQuery: '',
      appointmentType: [
        'all',
      ],
      doctors: [
        'all',
      ],
    },
    isDragging: false,
  }

  _dispatchAction = ({ action, ...args }, callback) => {
    const { dispatch } = this.props
    dispatch({ type: action, ...args })
    callback && callback()
  }

  closeAppointmentForm = () => this.setState({ showAppointmentForm: false })

  addEvent = (newEvent) => {
    this._dispatchAction(
      {
        action: CalendarActions.UpdateEvent,
        added: newEvent,
      },
      this.closeAppointmentForm,
    )
  }

  updateEventSeries = ({ seriesID, add, update }) => {
    add &&
      this._dispatchAction(
        {
          action: CalendarActions.AddEventSeries,
          series: add,
        },
        this.closeAppointmentForm,
      )

    update &&
      this._dispatchAction(
        {
          action: CalendarActions.UpdateEventSeriesByID,
          series: update,
          seriesID,
        },
        this.closeAppointmentForm,
      )
  }

  updateEvent = (changedEvent) => {
    this._dispatchAction(
      {
        action: CalendarActions.UpdateEvent,
        edited: changedEvent,
      },
      this.closeAppointmentForm,
    )
  }

  deleteEvent = (seriesID) => {
    this._dispatchAction(
      {
        action: CalendarActions.DeleteEventSeriesByID,
        seriesID,
      },
      this.closeAppointmentForm,
    )
  }

  moveEvent = (newCalendarEvents) => {
    this._dispatchAction({
      action: CalendarActions.MoveEvent,
      calendarEvents: newCalendarEvents,
    })
  }

  onSelectSlot = (event) => {
    console.log('onselectslot', { event })
    let hour = {
      seriesID: getUniqueGUID(),
      title: 'New Event',
      allDay: event.slots.length === 1,
      start: event.start,
      end: event.end,
      type: 'add',
    }

    this.setState({
      selectedSlot: { ...hour },
      isDragging: false,
      showAppointmentForm: true,
    })
  }

  onSelectEvent = (selectedEvent) => {
    const { isDoctorEvent } = selectedEvent

    this.setState({
      showPopup: false,
      isDragging: false,
      popoverEvent: { ...InitialPopoverEvent },
      popupAnchor: null,
      selectedSlot: { ...selectedEvent, type: 'update' },
      showAppointmentForm: !isDoctorEvent && true,
      showDoctorEventModal: isDoctorEvent,
    })
  }

  onEventMouseOver = (event, syntheticEvent) => {
    const { isDragging } = this.state

    !isDragging &&
      this.setState({
        showPopup: event !== null,
        popoverEvent: event !== null ? event : { ...InitialPopoverEvent },
        popupAnchor:
          syntheticEvent !== null
            ? syntheticEvent.currentTarget
            : syntheticEvent,
      })
  }

  handleClosePopover = () => {
    this.setState({
      showPopup: false,
      popoverEvent: { ...InitialPopoverEvent },
      popupAnchor: null,
    })
  }

  handleOnDragStart = () => {
    this.setState({
      showPopup: false,
      popoverEvent: { ...InitialPopoverEvent },
      popupAnchor: null,
      isDragging: true,
    })
  }

  onFilterUpdate = (newFilter) => {
    this.setState({
      filter: { ...newFilter },
    })
  }

  handleDoctorEventClick = () => {
    const { showDoctorEventModal } = this.state
    this.setState({ showDoctorEventModal: !showDoctorEventModal })
  }

  addDoctorEvent = (newDoctorEvent) => {
    const { calendar: { calendarEvents } } = this.props
    const idList = calendarEvents.map((a) => a.id)
    const newID = Math.max(...idList) + 1
    const doctorBlock = { id: newID, ...newDoctorEvent }
    this._dispatchAction(
      {
        action: CalendarActions.UpdateEvent,
        added: doctorBlock,
      },
      () => {
        this.setState({
          selectedSlot: {},
          showDoctorEventModal: false,
        })
      },
    )
  }

  render () {
    const { calendar: CalendarModel, classes } = this.props
    const {
      showPopup,
      popupAnchor,
      showAppointmentForm,
      showDoctorEventModal,
      // calendarEvents,
      selectedSlot,
      resources,
      popoverEvent,
      filter,
    } = this.state

    const { calendarEvents } = CalendarModel

    return (
      <CardContainer hideHeader size='sm'>
        <Popover
          id='event-popup'
          className={classes.popover}
          open={showPopup}
          anchorEl={popupAnchor}
          onClose={this.handleClosePopover}
          placement='top-start'
          anchorOrigin={{
            vertical: 'center',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'center',
            horizontal: 'left',
          }}
          disableRestoreFocus
        >
          <PopoverContent popoverEvent={popoverEvent} />
        </Popover>

        <FilterBar
          filter={filter}
          handleUpdateFilter={this.onFilterUpdate}
          onDoctorEventClick={this.handleDoctorEventClick}
        />
        <div style={{ marginTop: 16 }}>
          <CalendarView
            calendarEvents={applyFilter(calendarEvents, filter)}
            resources={resources}
            handleSelectSlot={this.onSelectSlot}
            handleSelectEvent={this.onSelectEvent}
            // handleDoubleClick={this.onSelectEvent}
            handleMoveEvent={this.moveEvent}
            handleEventMouseOver={this.onEventMouseOver}
            handleOnDragStart={this.handleOnDragStart}
          />
        </div>

        <CommonModal
          open={showAppointmentForm}
          title='Appointment'
          onClose={this.closeAppointmentForm}
          onConfirm={this.closeAppointmentForm}
          showFooter={false}
          maxWidth='lg'
        >
          <Form
            resources={resources}
            slotInfo={selectedSlot}
            calendarEvents={calendarEvents}
            handleUpdateEventSeries={this.updateEventSeries}
            handleAddEvents={this.addEvent}
            handleUpdateEvents={this.updateEvent}
            handleDeleteEvent={this.deleteEvent}
          />
        </CommonModal>
        <CommonModal
          open={showDoctorEventModal}
          title='Doctor Block'
          onClose={this.handleDoctorEventClick}
          onConfirm={this.handleDoctorEventClick}
          maxWidth='sm'
        >
          <DoctorBlockForm handleAddDoctorEvent={this.addDoctorEvent} />
        </CommonModal>
      </CardContainer>
    )
  }
}

export default withStyles(styles, { name: 'AppointmentPage' })(Appointment)
