import React from 'react'
import { connect } from 'dva'
import moment from 'moment'
// material ui
import { Popover, withStyles } from '@material-ui/core'
// common component
import { CardContainer, CommonModal, serverDateFormat } from '@/components'
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
} from './const'
import { VISIT_STATUS } from '@/pages/Reception/Queue/variables'

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
        {
          ...event,
          visitStatus: VISIT_STATUS.UPCOMING_APPT,
          startTime: event.appointment_Resources.reduce(
            (resources, res) => [
              ...resources,
              res.startTime,
            ],
            [],
          ),
        },
        // ...event.appointment_Resources.map((appointment) => {
        //   const { appointmentResources, ...restEvent } = event
        //   return {
        //     ...restEvent,
        //     ...appointment,
        //     visitStatus: VISIT_STATUS.UPCOMING_APPT,
        //     id: event.id,
        //   }
        // }),
      ]

@connect(({ calendar, codetable }) => ({
  calendar,
  // doctorProfiles: codetable.doctorprofile || [],
  clinicianProfiles: codetable.clinicianprofile || [],
}))
class Appointment extends React.PureComponent {
  state = {
    showPopup: false,
    showAppointmentForm: false,
    showDoctorEventModal: false,
    popupAnchor: null,
    popoverEvent: { ...InitialPopoverEvent },
    resources: null,
    // calendarEvents: dndEvents,
    selectedSlot: {},
    filter: {
      search: '',
      filterByApptType: [],
      filterByDoctor: [],
    },
    isDragging: false,
    selectedAppointmentFK: -1,
  }

  componentWillMount () {
    const startOfMonth = moment().startOf('month').format(serverDateFormat)
    const endOfMonth = moment().endOf('month').format(serverDateFormat)
    this.props.dispatch({
      type: 'calendar/query',
      payload: {
        combineCondition: 'and',
        lgt_appointmentDate: startOfMonth,
        lst_appointmentDate: endOfMonth,
      },
    })
    this.props.dispatch({
      type: 'calendar/setCurrentViewDate',
      payload: moment().toDate(),
    })
  }

  _dispatchAction = ({ action, ...args }, callback) => {
    const { dispatch } = this.props
    dispatch({ type: action, ...args })
    callback && callback()
  }

  closeAppointmentForm = () => {
    this.setState({ selectedAppointmentFK: -1, showAppointmentForm: false })

    this.props.dispatch({
      type: 'calendar/setViewAppointment',
      data: { appointments: [] },
    })
  }

  moveEvent = ({ updatedEvent, id, _appointmentID }) => {
    console.log({
      updatedEvent,
      id,
    })
    // this.setState({
    //   isDragging: false,
    // })
    // this._dispatchAction({
    //   action: CalendarActions.MoveEvent,
    //   updatedEvent,
    //   id,
    //   _appointmentID,
    // })
  }

  onSelectSlot = ({ start }) => {
    console.log({ start })
    const selectedSlot = {
      allDay: false,
      start,
    }

    this.setState({
      selectedSlot,
      isDragging: false,
      showAppointmentForm: true,
    })
  }

  onSelectEvent = (selectedEvent) => {
    const { id, appointmentFK } = selectedEvent
    const selectedAppointmentID =
      appointmentFK === undefined ? id : appointmentFK

    if (!selectedEvent.isEnableRecurrence) {
      this.props
        .dispatch({
          type: 'calendar/getAppointmentDetails',
          payload: {
            id: selectedAppointmentID,
            isEditedAsSingleAppointment: false,
            alwaysSingle: true,
          },
        })
        .then((response) => {
          if (response)
            this.setState({
              selectedAppointmentFK: selectedAppointmentID,
              showAppointmentForm: true,
            })
        })
    } else {
      this.setState({
        selectedAppointmentFK: selectedAppointmentID,
        showSeriesConfirmation: true,
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

  onFilterUpdate = (filter) => {
    const { filterByDoctor = [] } = filter
    const { clinicianProfiles } = this.props
    const newResources = clinicianProfiles.reduce(
      (resources, doctor) =>
        filterByDoctor.includes(doctor.id)
          ? [
              ...resources,
              {
                clinicianFK: doctor.id,
                doctorName: doctor.name,
              },
            ]
          : [
              ...resources,
            ],
      [],
    )
    this.setState((preState) => ({
      filter: { ...preState.filter, ...filter },
      resources: newResources.length > 0 ? newResources : null,
    }))
    // this.setState({
    //   filter: { ...newFilter },
    // })
  }

  handleAddAppointmentClick = () => {
    this.onSelectSlot({ start: new Date() })
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
    this.props.dispatch({
      type: 'calendar/setViewAppointment',
      data: { appointments: [] },
    })
    this.setState({ showSeriesConfirmation: false })
  }

  editSeriesConfirmation = (isEditedAsSingleAppointment = false) => {
    const { dispatch } = this.props
    const { selectedAppointmentFK } = this.state
    dispatch({
      type: 'calendar/getAppointmentDetails',
      payload: {
        id: selectedAppointmentFK,
        isEditedAsSingleAppointment,
      },
    }).then((response) => {
      if (response)
        this.setState({
          showPopup: false,
          isDragging: false,
          popupAnchor: null,
          showSeriesConfirmation: false,
          showAppointmentForm: true,
        })
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
      selectedAppointmentFK,
    } = this.state

    const {
      currentViewAppointment,
      isEditedAsSingleAppointment,
      calendarView,
    } = CalendarModel

    const formTitle =
      currentViewAppointment.id === undefined
        ? 'Appointment'
        : `Appointment ${isEditedAsSingleAppointment
            ? '(Editing Single)'
            : '(Editing Entire Series)'}`

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
          <PopoverContent
            popoverEvent={popoverEvent}
            calendarView={calendarView}
          />
        </Popover>

        <FilterBar
          handleUpdateFilter={this.onFilterUpdate}
          onDoctorEventClick={this.handleDoctorEventClick}
          onAddAppointmentClick={this.handleAddAppointmentClick}
        />
        <div style={{ marginTop: 16, minHeight: '80vh', height: '100%' }}>
          <CalendarView
            resources={resources}
            filter={filter}
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
          title={formTitle}
          onClose={this.closeAppointmentForm}
          onConfirm={this.closeAppointmentForm}
          showFooter={false}
          maxWidth='lg'
          overrideLoading
          observe='AppointmentForm'
        >
          <Form
            resources={resources}
            selectedAppointmentID={selectedAppointmentFK}
            selectedSlot={selectedSlot}
            // calendarEvents={calendarEvents}
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
          maxWidth='sm'
        >
          <SeriesConfirmation onConfirmClick={this.editSeriesConfirmation} />
        </CommonModal>
      </CardContainer>
    )
  }
}

export default withStyles(styles, { name: 'AppointmentPage' })(Appointment)
