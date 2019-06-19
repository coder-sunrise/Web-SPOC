import React from 'react'
// material ui
import { Popover, ClickAwayListener, withStyles } from '@material-ui/core'
import { Assignment } from '@material-ui/icons'
// common component
import { CommonHeader, CommonModal } from '@/components'
// sub component
import FilterBar from './components/FilterBar'
import CalendarView from './components/CalendarView'
import PopoverContent from './components/PopoverContent'
import Form from './components/form/Form'
import DoctorEventForm from './components/form/DoctorEvent'
// settings
import { defaultColorOpts, AppointmentTypeAsColor } from './setting'
// events data variable
import { dndEvents } from './events'

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

class Appointment extends React.PureComponent {
  state = {
    showPopup: false,
    showAppointmentForm: false,
    showDoctorEventModal: false,
    popupAnchor: null,
    popoverEvent: { ...InitialPopoverEvent },
    resources: [
      { resourceId: 'medisys', resourceTitle: 'Medisys' },
      { resourceId: 'levinne', resourceTitle: 'Levinne' },
      { resourceId: 'cheah', resourceTitle: 'Cheah' },
      { resourceId: 'other', resourceTitle: 'Other' },
    ],
    calendarEvents: dndEvents,
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

  addEvent = (newEvent) => {
    const { calendarEvents } = this.state
    const newCalendarEvents = [
      ...calendarEvents,
      newEvent,
    ]

    this.setState({
      selectedSlot: {},
      showAppointmentForm: false,
      calendarEvents: [
        ...newCalendarEvents,
      ],
    })
  }

  updateEvent = (changedEvent) => {
    const { calendarEvents } = this.state
    const newCalendarEvents = [
      ...calendarEvents.filter((event) => event.id !== changedEvent.id),
      changedEvent,
    ]

    this.setState({
      calendarEvents: [
        ...newCalendarEvents,
      ],
      showAppointmentForm: false,
      selectedSlot: {},
    })
  }

  deleteEvent = (eventID) => {
    const { calendarEvents } = this.state
    const newCalendarEvents = calendarEvents.filter(
      (event) => event.id !== eventID,
    )
    this.setState({
      calendarEvents: [
        ...newCalendarEvents,
      ],
      showAppointmentForm: false,
      selectedSlot: {},
    })
  }

  moveEvent = (newCalendarEvents) => {
    this.setState({ calendarEvents: newCalendarEvents, isDragging: false })
  }

  onSelectSlot = (event) => {
    let idList = this.state.calendarEvents.map((a) => a.id)
    let newId = Math.max(...idList) + 1
    let hour = {
      id: newId,
      title: 'New Event',
      allDay: event.slots.length === 1,
      start: event.start,
      end: event.end,
      resourceId: event.resourceId,
      type: 'add',
    }

    this.setState({
      selectedSlot: { ...hour },
      isDragging: false,
      showAppointmentForm: true,
    })
  }

  onSelectEvent = (selectedEvent) => {
    this.setState({
      showPopup: false,
      isDragging: false,
      popoverEvent: { ...InitialPopoverEvent },
      popupAnchor: null,
      selectedSlot: { ...selectedEvent, type: 'update' },
      showAppointmentForm: true,
    })
  }

  toggleAppointmentForm = () => {
    const { showAppointmentForm } = this.state
    this.setState({ showAppointmentForm: !showAppointmentForm })
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

  handleOnDragStart = ({ ...dragProps }) => {
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
    const { calendarEvents } = this.state
    const idList = this.state.calendarEvents.map((a) => a.id)
    const newId = Math.max(...idList) + 1
    const newCalendarEvents = [
      ...calendarEvents,
      { ...newDoctorEvent, id: newId },
    ]

    this.setState({
      selectedSlot: {},
      showDoctorEventModal: false,
      calendarEvents: [
        ...newCalendarEvents,
      ],
    })
  }

  render () {
    const { classes } = this.props
    const {
      showPopup,
      popupAnchor,
      showAppointmentForm,
      showDoctorEventModal,
      calendarEvents,
      selectedSlot,
      resources,
      popoverEvent,
      filter,
    } = this.state

    return (
      <CommonHeader Icon={<Assignment />}>
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
        <div>
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
          title='Appointment Form'
          onClose={this.toggleAppointmentForm}
          onConfirm={this.toggleAppointmentForm}
          showFooter={false}
        >
          {showAppointmentForm ? (
            <Form
              resources={resources}
              slotInfo={selectedSlot}
              handleAddEvents={this.addEvent}
              handleUpdateEvents={this.updateEvent}
              handleDeleteEvent={this.deleteEvent}
            />
          ) : null}
        </CommonModal>
        <CommonModal
          open={showDoctorEventModal}
          title='Doctor Block'
          onClose={this.handleDoctorEventClick}
          onConfirm={this.handleDoctorEventClick}
          maxWidth='sm'
        >
          {showDoctorEventModal && (
            <DoctorEventForm handleAddDoctorEvent={this.addDoctorEvent} />
          )}
        </CommonModal>
      </CommonHeader>
    )
  }
}

export default withStyles(styles, { name: 'AppointmentPage' })(Appointment)
