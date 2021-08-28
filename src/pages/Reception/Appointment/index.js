import React from 'react'
import { connect } from 'dva'
import moment from 'moment'
// material ui
import { withStyles } from '@material-ui/core'
// common component
import { CardContainer, CommonModal } from '@/components'
import { ReportViewer } from '@/components/_medisys'
// sub component
import BigCalendar from 'react-big-calendar'
import { APPOINTMENT_STATUS } from '@/utils/constants'
import { VISIT_STATUS } from '@/pages/Reception/Queue/variables'
import { getRemovedUrl } from '@/utils/utils'
import Authorized from '@/utils/Authorized'
import FilterBar from './components/FilterBar'
import FuncCalendarView from './components/FuncCalendarView'
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

const styles = theme => ({
  popover: {
    pointerEvents: 'none',
  },
  typography: {
    padding: theme.spacing.unit,
  },
  dateButton: {
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
    ? [...massaged]
    : [
        ...massaged,
        {
          ...event,
          visitStatus: VISIT_STATUS.UPCOMING_APPT,
          startTime: event.appointment_Resources.reduce(
            (resources, res) => [...resources, res.startTime],
            [],
          ),
        },
      ]

@connect(({ calendar, codetable, clinicInfo, loading, user, clinicSettings }) => ({
  calendar,
  calendarLoading: loading.models.calendar,
  // doctorProfiles: codetable.doctorprofile || [],
  clinicInfo,
  doctorprofile: codetable.doctorprofile || [],
  user,
  apptTimeIntervel: clinicSettings.settings.apptTimeIntervel,
}))
class Appointment extends React.PureComponent {
  state = {
    showAppointmentForm: false,
    showDoctorEventModal: false,
    showSearchAppointmentModal: false,
    resources: null,
    selectedSlot: {},
    filter: {
      search: '',
      dob: null,
      filterByApptType: [],
      filterByDoctor: [],
    },
    isDragging: false,
    selectedAppointmentFK: -1,
    selectedDoctorEventFK: -1,
  }

  async componentWillMount() {
    const { dispatch, clinicInfo } = this.props
    const startOfMonth = moment()
      .startOf('month')
      .formatUTC()
    const endOfMonth = moment()
      .endOf('month')
      .endOf('day')
      .formatUTC(false)

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

    let filter //= this.state.filter
    const filterTemplate = await dispatch({
      type: 'appointment/getFilterTemplate',
    })
    if (filterTemplate) {
      const { currentFilterTemplate } = filterTemplate
      if (currentFilterTemplate) {
        const {
          filterByDoctor,
          filterByApptType,
          dob,
        } = currentFilterTemplate
        filter = {
          filterByDoctor,
          filterByApptType,
          filterBySingleDoctor:
            filterByDoctor && filterByDoctor.length
              ? filterByDoctor[0]
              : undefined,
          dob,
        }
      }
    }

    const response = await dispatch({
      type: 'codetable/fetchCodes',
      payload: {
        code: 'doctorprofile',
        force: true,
        filter: {},
      },
    })

    if (response) {
      let filterByDoctor = []
      let filterBySingleDoctor
      let resources = []
      let primaryClinicianFK

      const viewOtherApptAccessRight = Authorized.check(
        'appointment.viewotherappointment',
      )
      if (
        viewOtherApptAccessRight &&
        viewOtherApptAccessRight.rights === 'enable'
      ) {
        const favDoctors = filter ? filter.filterByDoctor || [] : []
        const lastSelected = JSON.parse(
          sessionStorage.getItem('appointmentDoctors') || '[]',
        )
        let filterDoctors = []
        if (favDoctors.length > 0) {
          filterDoctors = favDoctors
        } else if (lastSelected.length > 0) {
          filterDoctors = lastSelected
        }

        resources = response
          .filter(clinician => clinician.clinicianProfile.isActive)
          .filter((_, index) =>
            filterDoctors.length > 0
              ? filterDoctors.includes(_.clinicianProfile.id)
              : index < 5,
          )
          .map(clinician => ({
            clinicianFK: clinician.clinicianProfile.id,
            doctorName: clinician.clinicianProfile.name,
          }))
      } else {
        resources = response
          .filter(clinician => clinician.clinicianProfile.isActive)
          .filter(activeclinician => {
            const { user } = this.props
            return (
              activeclinician.clinicianProfile.id ===
              user.data.clinicianProfile.id
            )
          })
          .map(clinician => ({
            clinicianFK: clinician.clinicianProfile.id,
            doctorName: clinician.clinicianProfile.name,
          }))
      }
      filterByDoctor = resources.map(res => res.clinicianFK)
      filterBySingleDoctor =
        resources && resources.length ? resources[0].clinicianFK : undefined

      this.setState(() => ({
        filter: {
          ...filter,
          filterByDoctor,
          filterBySingleDoctor,
        },
        primaryClinicianFK,
        resources,
      }))
    } else {
      this.setState({ filter })
    }

    dispatch({
      type: 'calendar/initState',
      payload: { start: startOfMonth },
    })
    dispatch({
      type: 'doctorBlock/query',
      payload: {
        lgteql_startDateTime: startOfMonth,
      },
    })

    dispatch({
      type: 'calendar/setCurrentViewDate',
      payload: moment().toDate(),
    })
  }

  componentWillUnmount() {
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

    history.push(getRemovedUrl(['md', 'pid', 'apptid']))
  }

  moveEvent = props => {
    this.setState({
      isDragging: false,
    })
  }

  printDailyAppointmentReport = (date,clinicianFK) => {
    this.reportDailyAppt(date,date,clinicianFK)
  }

  reportDailyAppt = (start, end, resourceId) => {
    this.setState({
      selectedSlot: { start, end, resourceId },
      showDailyAppointmentListingReport: true,
    })
  }

  createDailyApptListingPayload = ({ start, end, resourceId }) => {
    var payload = {
      apptDateFrom: moment(start)
        .set({ hour: 0, minute: 0, second: 0, millisecond:0 })
        .toDate(),
      apptDateto: moment(end)
        .set({ hour: 23, minute: 59, second: 59 })
        .toDate(),
      doctor: resourceId,
    }
    return payload
  }

  onSelectSlot = props => {
    const { start, end, resourceId, action } = props || {}
    const createApptAccessRight = Authorized.check('appointment.newappointment')

    if (createApptAccessRight && createApptAccessRight.rights !== 'enable')
      return

    if (action === 'select' || action === 'click') return

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

  onDoubleClickEvent = doubleClickEvent => {
    const {
      id,
      appointmentFK,
      isEditedAsSingleAppointment,
      isEditedAsSingleDoctorBlock,
      isEnableRecurrence,
      appointmentStatusFk,
      isHistory,
      isDoctorBlock,
    } = doubleClickEvent

    if (
      isHistory &&
      [
        APPOINTMENT_STATUS.RESCHEDULED,
        APPOINTMENT_STATUS.PFA_RESCHEDULED,
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
      let shouldShowDoctorBlockForm = true

      if (this.state.showDoctorEventModal) {
        this.setState({
          selectedDoctorEventFK: undefined,
          showDoctorEventModal: false,
          isDragging: false,
        })
      }

      if (isEnableRecurrence) {
        if (!isEditedAsSingleDoctorBlock) {
          shouldShowDoctorBlockForm = false
          this.setState({
            selectedDoctorEventFK: id,
            showSeriesConfirmation: true,
            eventType: 'DoctorBlock',
            isDragging: false,
          })
        }
      }
      if (shouldShowDoctorBlockForm) {
        this.props
          .dispatch({
            type: 'doctorBlock/getDoctorBlockDetails',
            payload: {
              id,
              mode: 'single',
            },
          })
          .then(response => {
            if (response) {
              this.setState({
                selectedDoctorEventFK: id,
                showDoctorEventModal: true,
                isDragging: false,
              })
            }
          })
      }
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
            eventType: 'Appointment',
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
              mode: 'single',
            },
          })
          .then(response => {
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

  onFilterClick = filter => {
    this.props.dispatch({
      type: 'calendar/filterCalendar',
      payload: { ...filter },
    })
  }

  onFilterUpdate = filter => {
    const {
      filterByDoctor = [],
      dob,
      search,
      filterByApptType,
      filterBySingleDoctor,
    } = filter
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
          : [...resources],
      [],
    )

    const updFilter = {
      dob: dob || undefined,
      search: search || undefined,
      filterByApptType: filterByApptType,
      filterByDoctor: filterByDoctor,
      filterBySingleDoctor: filterBySingleDoctor,
    }

    this.setState(() => ({
      filter: { ...updFilter },
      resources: newResources.length > 0 ? newResources : null,
    }))

    this.props.dispatch({
      type: 'calendar/filterCalendar',
      payload: {
        search: updFilter.search,
        dob: updFilter.dob,
        doctor: updFilter.filterByDoctor,
        appType: updFilter.filterByApptType,
      },
    })
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
        isEditedAsSingleDoctorBlock: false,
      },
    })
  }

  closeSeriesConfirmation = () => {
    this.props.dispatch({
      type: 'calendar/setViewAppointment',
      data: { appointments: [] },
    })
    this.setState({ showSeriesConfirmation: false, eventType: '' })
  }

  editSeriesConfirmation = (isEditedAsSingle = false) => {
    const { dispatch } = this.props
    const {
      selectedAppointmentFK,
      eventType,
      selectedDoctorEventFK,
    } = this.state
    dispatch({
      type:
        eventType === 'Appointment'
          ? 'calendar/getAppointmentDetails'
          : 'doctorBlock/getDoctorBlockDetails',
      payload: {
        id:
          eventType === 'Appointment'
            ? selectedAppointmentFK
            : selectedDoctorEventFK,
        // isEditedAsSingleAppointment,
        mode: isEditedAsSingle ? 'single' : 'series',
      },
    }).then(response => {
      if (response)
        this.setState({
          isDragging: false,
          showSeriesConfirmation: false,
          eventType: '',
          showAppointmentForm: eventType === 'Appointment',
          showDoctorEventModal: eventType === 'DoctorBlock',
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

    this.setState(prevState => {
      return {
        showSearchAppointmentModal: !prevState.showSearchAppointmentModal,
      }
    })
  }

  toggleDailyAppointmentListingReport = () => {
    this.setState(prevState => {
      return {
        showDailyAppointmentListingReport: !prevState.showDailyAppointmentListingReport,
      }
    })
  }

  render() {
    const {
      calendar: CalendarModel,
      calendarLoading,
      dispatch,
      user,
      doctorprofile,
      apptTimeIntervel,
    } = this.props
    const {
      showAppointmentForm,
      showDoctorEventModal,
      showSeriesConfirmation,
      selectedSlot,
      resources,
      filter,
      selectedAppointmentFK,
      showSearchAppointmentModal,
      eventType,
      showDailyAppointmentListingReport,
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
          search={filter.search}
          dob={filter.dob}
          loading={calendarLoading}
          filterByDoctor={filter.filterByDoctor}
          filterBySingleDoctor={filter.filterBySingleDoctor}
          filterByApptType={filter.filterByApptType}
          handleUpdateFilter={this.onFilterUpdate}
          onFilterClick={this.onFilterClick}
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
              handleDoubleClick={this.onDoubleClickEvent}
              handleMoveEvent={this.moveEvent}
              handleEventMouseOver={this.onEventMouseOver}
              handleOnDragStart={this.handleOnDragStart}
              printDailyAppointmentReport={this.printDailyAppointmentReport}
            />
          </div>
        </Authorized>

        <CommonModal
          open={showAppointmentForm}
          title={formTitle}
          onClose={this.closeAppointmentForm}
          onConfirm={this.closeAppointmentForm}
          showFooter={false}
          fullScreen
          overrideLoading
          observe='AppointmentForm'
        >
          {showAppointmentForm && (
            <Form
              history={this.props.history}
              resources={resources}
              selectedAppointmentID={selectedAppointmentFK}
              selectedSlot={{
                ...selectedSlot,
                resourceId:
                  calendarView === BigCalendar.Views.DAY
                    ? selectedSlot.resourceId
                    : filter.filterBySingleDoctor,
              }}
              onHistoryRowSelected={this.onDoubleClickEvent}
              apptTimeIntervel={apptTimeIntervel}
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
          <SeriesConfirmation
            eventType={eventType}
            onConfirmClick={this.editSeriesConfirmation}
          />
        </CommonModal>

        <CommonModal
          open={showSearchAppointmentModal}
          title='Appointment Search'
          onClose={this.toggleSearchAppointmentModal}
          maxWidth='xl'
        >
          <AppointmentSearch
            handleDoubleClick={this.onDoubleClickEvent}
            handleAddAppointmentClick={this.handleAddAppointmentClick}
            currentUser={user.data.clinicianProfile.id}
            doctorprofile={doctorprofile}
          />
        </CommonModal>

        <CommonModal
          open={showDailyAppointmentListingReport}
          onClose={this.toggleDailyAppointmentListingReport}
          title='Daily Appointment Listing'
          maxWidth='lg'
        >
          <ReportViewer
            showTopDivider={false}
            reportID={81}
            reportParameters={{
              ...this.createDailyApptListingPayload(selectedSlot),
            }}
            defaultScale={1.5}
          />
        </CommonModal>
      </CardContainer>
    )
  }
}

export default withStyles(styles, { name: 'AppointmentPage' })(Appointment)
