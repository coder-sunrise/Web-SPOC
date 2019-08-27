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
      { clinicianFK: 1, doctorName: 'Medisys' },
      { clinicianFK: '2', doctorName: 'Levinne' },
      { clinicianFK: '3', doctorName: 'Cheah' },
      { clinicianFK: '4', doctorName: 'Tan' },
      { clinicianFK: '5', doctorName: 'Other' },
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
      date: moment().toDate(),
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
    this.props
      .dispatch({
        type: 'calendar/getAppointmentDetails',
        appointmentID: selectedEvent.id
          ? selectedEvent.id
          : selectedEvent.appointmentFK,
      })
      .then(() => {
        this.setState({
          selectedAppointmentFK: selectedEvent.id
            ? selectedEvent.id
            : selectedEvent.appointmentFK,
          showSeriesConfirmation: selectedEvent.isEnableRecurrence,
          showAppointmentForm: !selectedEvent.isEnableRecurrence,
        })
      })
    // start and end are unwated values,
    // the important values are the ...restEvent
    // const { start, end, ...restEvent } = selectedEvent
    // const { isDoctorEvent, series } = restEvent

    // if (series) {
    //   this.setState({
    //     showSeriesConfirmation: true,
    //     selectedSlot: { ...restEvent, type: 'update' },
    //     // showAppointmentForm: !isDoctorEvent && true,
    //     // showDoctorEventModal: isDoctorEvent,
    //   })
    // } else {
    //   this.setState({
    //     showPopup: false,
    //     isDragging: false,
    //     popoverEvent: { ...InitialPopoverEvent },
    //     popupAnchor: null,
    //     selectedSlot: { ...restEvent, type: 'update' },
    //     showAppointmentForm: !isDoctorEvent && true,
    //     showDoctorEventModal: isDoctorEvent,
    //   })
    // }
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
    this.props.dispatch({
      type: 'calendar/setViewAppointment',
      data: { appointments: [] },
    })
    this.setState({ showSeriesConfirmation: false })
  }

  editSeriesConfirmation = (editSingleAppointment = false) => {
    const { calendar, dispatch } = this.props
    dispatch({
      type: 'calendar/setViewAppointment',
      data: {
        ...calendar.currentViewAppointment,
        editSingleAppointment,
      },
    })
    this.setState({
      showPopup: false,
      isDragging: false,
      popupAnchor: null,
      showSeriesConfirmation: false,
      showAppointmentForm: true,
    })
    // const { selectedSlot } = this.state
    // const { isDoctorEvent } = selectedSlot
    // this.setState({
    //   showSeriesConfirmation: false,
    //   showPopup: false,
    //   isDragging: false,
    //   popoverEvent: { ...InitialPopoverEvent },
    //   popupAnchor: null,
    //   // selectedSlot: { ...selectedEvent, type: 'update' },
    //   showAppointmentForm: !isDoctorEvent && true,
    //   showDoctorEventModal: isDoctorEvent,
    // })
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
      calendarEvents,
      list,
      currentViewAppointment,
      calendarView,
    } = CalendarModel
    // const flattenedCalendarData = calendarEvents.reduce(
    //   flattenAppointmentDateToCalendarEvents,
    //   [],
    // )

    // console.log({ flattenedList })

    const formTitle =
      currentViewAppointment.editSingleAppointment === undefined
        ? 'Appointment'
        : `Appointment ${currentViewAppointment.editSingleAppointment
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
          filter={filter}
          handleUpdateFilter={this.onFilterUpdate}
          onDoctorEventClick={this.handleDoctorEventClick}
        />
        <div style={{ marginTop: 16 }}>
          <CalendarView
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
          title={formTitle}
          onClose={this.closeAppointmentForm}
          onConfirm={this.closeAppointmentForm}
          showFooter={false}
          maxWidth='lg'
          overrideLoading
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
