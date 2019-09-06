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
import SeriesConfirmation from './SeriesConfirmation'
// settings
import { defaultColorOpts, AppointmentTypeAsColor } from './setting'
import {
  CalendarActions,
  DoctorFormValidation,
  InitialPopoverEvent,
  applyFilter,
} from './const'
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

export const flattenAppointmentDateToCalendarEvents = (massaged, event) =>
  event.isDoctorEvent
    ? [
        ...massaged,
      ]
    : [
        ...massaged,
        ...event.appointmentResources.map((appointment) => {
          const { appointmentResources, ...restEvent } = event
          return { ...restEvent, ...appointment }
        }),
      ]

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

  updateEventSeries = ({ _appointmentID, add, update }) => {
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
          action: CalendarActions.UpdateEventByEventID,
          series: update,
          _appointmentID,
        },
        this.closeAppointmentForm,
      )
  }

  deleteEvent = (eventID, appointmentID) => {
    this._dispatchAction(
      {
        action: CalendarActions.DeleteEventByEventID,
        eventID,
        appointmentID,
      },
      this.closeAppointmentForm,
    )
  }

  moveEvent = ({ updatedEvent, id, _appointmentID }) => {
    this.setState({
      isDragging: false,
    })
    this._dispatchAction({
      action: CalendarActions.MoveEvent,
      updatedEvent,
      id,
      _appointmentID,
    })
  }

  onSelectSlot = ({ start }) => {
    let hour = {
      _appointmentID: getUniqueGUID(),
      allDay: false,
      start,
      // start: event.start,
      // end: event.end,
      type: 'add',
    }

    this.setState({
      selectedSlot: { ...hour },
      isDragging: false,
      showAppointmentForm: true,
    })
  }

  onSelectEvent = (selectedEvent) => {
    // start and end are unwated values,
    // the important values are the ...restEvent
    const { start, end, ...restEvent } = selectedEvent
    const { isDoctorEvent, series } = restEvent

    if (series) {
      this.setState({
        showSeriesConfirmation: true,
        selectedSlot: { ...restEvent, type: 'update' },
        // showAppointmentForm: !isDoctorEvent && true,
        // showDoctorEventModal: isDoctorEvent,
      })
    } else {
      this.setState({
        showPopup: false,
        isDragging: false,
        popoverEvent: { ...InitialPopoverEvent },
        popupAnchor: null,
        selectedSlot: { ...restEvent, type: 'update' },
        showAppointmentForm: !isDoctorEvent && true,
        showDoctorEventModal: isDoctorEvent,
      })
    }
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

  updateDoctorEvent = (doctorEvent) => {
    this._dispatchAction(
      {
        action: CalendarActions.UpdateDoctorEvent,
        ...doctorEvent,
      },
      () => {
        this.setState({
          selectedSlot: {},
          showDoctorEventModal: false,
        })
      },
    )
  }

  closeSeriesConfirmation = () => {
    this.setState({ showSeriesConfirmation: false })
  }

  confirmSeriesConfirmation = () => {
    const { selectedSlot } = this.state
    const { isDoctorEvent } = selectedSlot
    this.setState({
      showSeriesConfirmation: false,
      showPopup: false,
      isDragging: false,
      popoverEvent: { ...InitialPopoverEvent },
      popupAnchor: null,
      // selectedSlot: { ...selectedEvent, type: 'update' },
      showAppointmentForm: !isDoctorEvent && true,
      showDoctorEventModal: isDoctorEvent,
    })
  }

  render () {
    const { calendar: CalendarModel, classes } = this.props
    const {
      showPopup,
      popupAnchor,
      showAppointmentForm,
      showDoctorEventModal,
      showSeriesConfirmation,
      // calendarEvents,
      selectedSlot,
      resources,
      popoverEvent,
      filter,
    } = this.state

    const { calendarEvents } = CalendarModel
    const flattenedCalendarData = calendarEvents.reduce(
      flattenAppointmentDateToCalendarEvents,
      [],
    )

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
            calendarEvents={applyFilter(flattenedCalendarData, filter)}
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
          <DoctorBlockForm
            initialProps={selectedSlot}
            handleUpdateDoctorEvent={this.updateDoctorEvent}
            validationSchema={DoctorFormValidation}
          />
        </CommonModal>
        <CommonModal
          open={showSeriesConfirmation}
          title='Alert'
          onClose={this.closeSeriesConfirmation}
          onConfirm={this.confirmSeriesConfirmation}
          maxWidth='sm'
        >
          <SeriesConfirmation />
        </CommonModal>
      </CardContainer>
    )
  }
}

export default withStyles(styles, { name: 'AppointmentPage' })(Appointment)
