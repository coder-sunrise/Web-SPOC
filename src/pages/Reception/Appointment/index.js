import React from 'react'
import { connect } from 'dva'
import moment from 'moment'
// material ui
import { Popover, withStyles } from '@material-ui/core'
// common component
import { CardContainer, CommonModal } from '@/components'
// sub component
import FilterBar from './components/FilterBar'
import FuncCalendarView from './components/FuncCalendarView'
import PopoverContent from './components/PopoverContent'
import Form from './components/form/Form'
import DoctorBlockForm from './components/form/DoctorBlock'
import SeriesConfirmation from './SeriesConfirmation'
// settings
import {
  defaultColorOpts,
  DoctorFormValidation,
  InitialPopoverEvent,
} from './utils'
import { VISIT_STATUS } from '@/pages/Reception/Queue/variables'
// utils
import { getRemovedUrl } from '@/utils/utils'
import Authorized from '@/utils/Authorized'

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
    const { dispatch } = this.props
    const startOfMonth = moment().startOf('month').add(-8, 'hours').formatUTC()
    const endOfMonth = moment().endOf('month').add(-8, 'hours').formatUTC()

    dispatch({
      type: 'calendar/query',
      payload: {
        combineCondition: 'and',
        lgteql_appointmentDate: startOfMonth,
        lsteql_appointmentDate: endOfMonth,
      },
    })

    // dispatch({
    //   type: 'calendar/getPublicHolidayList',
    //   payload: { start: startOfMonth },
    // })
    dispatch({
      type: 'calendar/initState',
      payload: { start: startOfMonth },
    })
    dispatch({
      type: 'doctorBlock/query',
      payload: {
        pagesize: 9999,
        lgteql_startDateTime: startOfMonth,
      },
    })

    dispatch({
      type: 'calendar/setCurrentViewDate',
      payload: moment().toDate(),
    })
  }

  closeAppointmentForm = () => {
    this.setState({ selectedAppointmentFK: -1, showAppointmentForm: false })
    const { dispatch, history } = this.props
    dispatch({
      type: 'calendar/updateState',
      payload: {
        currentViewAppointment: { appointments: [] },
        conflicts: [],
        isEditedAsSingleAppointment: false,
      },
    })

    dispatch({
      type: 'global/updateState',
      payload: {
        disableSave: false,
      },
    })

    dispatch({
      type: 'patient/updateState',
      payload: { entity: null },
    })

    history.push(
      getRemovedUrl([
        'md',
        'pid',
        'apptid',
      ]),
    )
  }

  moveEvent = (props) => {
    console.log({
      props,
    })
    this.setState({
      isDragging: false,
    })
  }

  onSelectSlot = (props) => {
    let { start, end } = props
    const selectedSlot = {
      allDay: start - end === 0,
      start,
      end,
    }

    this.setState({
      selectedSlot,
      isDragging: false,
      showAppointmentForm: true,
    })
  }

  onSelectEvent = (selectedEvent) => {
    const {
      id,
      appointmentFK,
      doctor,
      isEditedAsSingleAppointment,
      isEnableRecurrence,
    } = selectedEvent

    if (doctor) {
      this.props
        .dispatch({
          type: 'doctorBlock/queryOne',
          payload: {
            id,
          },
        })
        .then((response) => {
          if (response) {
            this.setState({
              showDoctorEventModal: true,
              isDragging: false,
            })
          }
        })
    } else {
      const selectedAppointmentID =
        appointmentFK === undefined ? id : appointmentFK
      let shouldShowApptForm = true

      if (isEnableRecurrence) {
        if (!isEditedAsSingleAppointment) {
          shouldShowApptForm = false
          this.setState({
            selectedAppointmentFK: selectedAppointmentID,
            showSeriesConfirmation: true,
            isDragging: false,
          })
        }
      }
      if (shouldShowApptForm) {
        this.props
          .dispatch({
            type: 'calendar/getAppointmentDetails',
            payload: {
              id: selectedAppointmentID,
              // isEditedAsSingleAppointment: isEnableRecurrence
              //   ? false
              //   : isEditedAsSingleAppointment,
              mode: 'single',
            },
          })
          .then((response) => {
            if (response)
              this.setState({
                selectedAppointmentFK: selectedAppointmentID,
                showAppointmentForm: true,
                isDragging: false,
              })
          })
      }
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
    this.onSelectSlot({ start: new Date(), end: new Date() })
  }

  handleDoctorEventClick = () => {
    const { showDoctorEventModal } = this.state
    this.setState({ showDoctorEventModal: !showDoctorEventModal })
    this.props.dispatch({
      type: 'doctorBlock/updateState',
      payload: {
        currentViewDoctorBlock: {},
      },
    })
  }

  closeDoctorBlockModal = () => {
    this.setState({ showDoctorEventModal: false })
    this.props.dispatch({
      type: 'doctorBlock/updateState',
      payload: {
        currentViewDoctorBlock: {},
      },
    })
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
        // isEditedAsSingleAppointment,
        mode: isEditedAsSingleAppointment ? 'single' : 'series',
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

    const { currentViewAppointment, mode, calendarView } = CalendarModel

    let formTitle = 'Appointment'

    if (currentViewAppointment.isEnableRecurrence) {
      formTitle =
        mode === 'single'
          ? `${formTitle} (Editing Single) `
          : `${formTitle} (Editing Entire Series) `
    }

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
        <Authorized authority='appointment.appointmentdetails'>
          <div style={{ marginTop: 16, minHeight: '80vh', height: '100%' }}>
            <FuncCalendarView
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
        </Authorized>

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
            history={this.props.history}
            resources={resources}
            selectedAppointmentID={selectedAppointmentFK}
            selectedSlot={selectedSlot}
            // calendarEvents={calendarEvents}
          />
        </CommonModal>
        <CommonModal
          open={showDoctorEventModal}
          title='Doctor Block'
          onClose={this.closeDoctorBlockModal}
          onConfirm={this.handleDoctorEventClick}
          observe='DoctorBlockForm'
        >
          <DoctorBlockForm
            initialProps={selectedSlot}
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
