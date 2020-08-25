import React from 'react'
import { connect } from 'dva'
import moment from 'moment'
// material ui
import { Popover, withStyles } from '@material-ui/core'
// common component
import { CardContainer, CommonModal } from '@/components'
// sub component
import { APPOINTMENT_STATUS } from '@/utils/constants'
import { VISIT_STATUS } from '@/pages/Reception/Queue/variables'
import { getRemovedUrl } from '@/utils/utils'
import Authorized from '@/utils/Authorized'
import FilterBar from './components/FilterBar'
import FuncCalendarView from './components/FuncCalendarView'
import ApptPopover from './components/ApptPopover'
import DoctorBlockPopover from './components/DoctorBlockPopover'
import Form from './components/form'
import DoctorBlockForm from './components/form/DoctorBlock'
import SeriesConfirmation from './SeriesConfirmation'
import AppointmentSearch from './AppointmentSearch'
// settings
import {
  defaultColorOpts,
  DoctorFormValidation,
  InitialPopoverEvent,
} from './utils'
// utils

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

@connect(({ calendar, codetable, clinicInfo, loading, user }) => ({
  calendar,
  calendarLoading: loading.models.calendar,
  // doctorProfiles: codetable.doctorprofile || [],
  clinicInfo,
  doctorprofile: codetable.doctorprofile || [],
  user,
}))
class Appointment extends React.PureComponent {
  state = {
    primaryClinicianFK: undefined,
    showPopup: false,
    showAppointmentForm: false,
    showDoctorEventModal: false,
    showSearchAppointmentModal: false,
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
    const { dispatch, clinicInfo } = this.props
    const startOfMonth = moment().startOf('month').formatUTC()
    const endOfMonth = moment().endOf('month').endOf('day').formatUTC(false)

    dispatch({
      type: 'calendar/query',
      payload: {
        pagesize: 9999,
        apiCriteria: {
          isCancelled: false,
          apptDateFrom: startOfMonth,
          apptDateTo: endOfMonth,
        },
      },
    })
    dispatch({
      type: 'codetable/fetchCodes',
      payload: {
        code: 'clinicianprofile',
        force: true,
        filter: {
          isActive: undefined,
        },
      },
    })

    dispatch({
      type: 'codetable/fetchCodes',
      payload: {
        code: 'doctorprofile',
        force: true,
        filter: {},
      },
    }).then((response) => {
      response

      let filterByDoctor = []
      let resources = []
      let primaryClinicianFK
      if (response) {
        const lastSelected = JSON.parse(
          sessionStorage.getItem('appointmentDoctors') || '[]',
        )

        const viewOtherApptAccessRight = Authorized.check(
          'appointment.viewotherappointment',
        )
        if (
          viewOtherApptAccessRight &&
          viewOtherApptAccessRight.rights === 'enable'
        ) {
          resources = response
            .filter((clinician) => clinician.clinicianProfile.isActive)
            .filter(
              (_, index) =>
                lastSelected.length > 0
                  ? lastSelected.includes(_.clinicianProfile.id)
                  : index < 5,
            )
            .map((clinician) => ({
              clinicianFK: clinician.clinicianProfile.id,
              doctorName: clinician.clinicianProfile.name,
            }))
        } else {
          resources = response
            .filter((clinician) => clinician.clinicianProfile.isActive)
            .filter((activeclinician) => {
              const { user } = this.props
              return (
                activeclinician.clinicianProfile.id ===
                user.data.clinicianProfile.id
              )
            })
            .map((clinician) => ({
              clinicianFK: clinician.clinicianProfile.id,
              doctorName: clinician.clinicianProfile.name,
            }))
        }
        filterByDoctor = resources.map((res) => res.clinicianFK)
      }

      this.setState((preState) => ({
        filter: {
          ...preState.filter,
          filterByDoctor,
        },
        primaryClinicianFK,
        resources,
      }))
    })

    dispatch({
      type: 'calendar/initState',
      payload: { start: startOfMonth },
    })
    dispatch({
      type: 'doctorBlock/queryAll',
      payload: {
        lgteql_startDateTime: startOfMonth,
      },
    })

    dispatch({
      type: 'calendar/setCurrentViewDate',
      payload: moment().toDate(),
    })

    dispatch({
      type: 'appointment/getFilterTemplate',
    })
  }

  componentWillUnmount () {
    const { dispatch } = this.props
    // reset doctor profile codetable
    dispatch({
      type: 'codetable/fetchCodes',
      payload: {
        code: 'doctorprofile',
        force: true,
        filter: {
          'clinicianProfile.isActive': true,
        },
      },
    })

    // reset clinician profile codetable
    dispatch({
      type: 'codetable/fetchCodes',
      payload: {
        code: 'clinicianprofile',
        force: true,
      },
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
    this.setState({
      isDragging: false,
    })
  }

  onSelectSlot = (props) => {
    const { start, end, resourceId } = props
    const createApptAccessRight = Authorized.check('appointment.newappointment')

    if (createApptAccessRight && createApptAccessRight.rights !== 'enable')
      return

    const selectedSlot = {
      allDay: start - end === 0,
      start,
      end,
      resourceId,
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
      appointmentStatusFk,
      isHistory,
    } = selectedEvent

    const isDoctorBlock = doctor && doctor.id > 0

    if (
      isHistory &&
      ![
        APPOINTMENT_STATUS.DRAFT,
        APPOINTMENT_STATUS.CONFIRMED,
      ].includes(appointmentStatusFk)
    )
      return

    const viewApptAccessRight = Authorized.check(
      'appointment.appointmentdetails',
    )
    const viewDoctorBlockAccessRight = Authorized.check(
      'settings.clinicsetting.doctorblock',
    )

    if (
      (viewApptAccessRight &&
        viewApptAccessRight.rights !== 'enable' &&
        !isDoctorBlock) ||
      (isDoctorBlock &&
        viewDoctorBlockAccessRight &&
        viewDoctorBlockAccessRight.rights !== 'enable')
    )
      return

    if (isDoctorBlock) {
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

      if (this.state.showAppointmentForm) {
        this.setState({
          selectedAppointmentFK: undefined,
          showAppointmentForm: false,
          isDragging: false,
        })
      }

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
    const { doctorprofile } = this.props

    const newResources = doctorprofile.reduce(
      (resources, doctor) =>
        filterByDoctor.includes(doctor.clinicianProfile.id)
          ? [
              ...resources,
              {
                clinicianFK: doctor.clinicianProfile.id,
                doctorName: doctor.clinicianProfile.name,
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

  handleAfterSubmitDoctorBlock = () => {
    this.props.dispatch({
      type: 'calendar/refresh',
    })
  }

  queryCodetables = async () => {
    const { dispatch } = this.props
    await Promise.all([
      dispatch({
        type: 'codetable/fetchCodes',
        payload: {
          code: 'ctroom',
        },
      }),
      dispatch({
        type: 'codetable/fetchCodes',
        payload: {
          code: 'ltappointmentstatus',
        },
      }),
    ])
  }

  toggleSearchAppointmentModal = async () => {
    await this.queryCodetables()

    this.setState((prevState) => {
      return {
        showSearchAppointmentModal: !prevState.showSearchAppointmentModal,
      }
    })
  }

  render () {
    const {
      calendar: CalendarModel,
      classes,
      calendarLoading,
      dispatch,
      user,
      doctorprofile,
    } = this.props
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
      primaryClinicianFK,
      showSearchAppointmentModal,
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
        <FilterBar
          dispatch={dispatch}
          loading={calendarLoading}
          filterByDoctor={filter.filterByDoctor}
          filterByApptType={filter.filterByApptType}
          handleUpdateFilter={this.onFilterUpdate}
          onDoctorEventClick={this.handleDoctorEventClick}
          onAddAppointmentClick={this.handleAddAppointmentClick}
          toggleSearchAppointmentModal={this.toggleSearchAppointmentModal}
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
          maxWidth='xl'
          overrideLoading
          observe='AppointmentForm'
        >
          {showAppointmentForm && (
            <Form
              history={this.props.history}
              resources={resources}
              selectedAppointmentID={selectedAppointmentFK}
              selectedSlot={selectedSlot}
              onHistoryRowSelected={this.onSelectEvent}
              // calendarEvents={calendarEvents}
            />
          )}
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
            handleAfterSubmit={this.handleAfterSubmitDoctorBlock}
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

        <CommonModal
          open={showSearchAppointmentModal}
          title='Appointment Search'
          onClose={this.toggleSearchAppointmentModal}
          maxWidth='xl'
        >
          <AppointmentSearch
            handleSelectEvent={this.onSelectEvent}
            handleAddAppointmentClick={this.handleAddAppointmentClick}
            currentUser={user.data.clinicianProfile.id}
            doctorprofile={doctorprofile}
          />
        </CommonModal>
      </CardContainer>
    )
  }
}

export default withStyles(styles, { name: 'AppointmentPage' })(Appointment)
