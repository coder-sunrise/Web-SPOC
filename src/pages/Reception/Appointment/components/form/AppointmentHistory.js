import React, { PureComponent } from 'react'
import moment from 'moment'
import { connect } from 'dva'
import { withStyles } from '@material-ui/core'
import { CardContainer, CommonTableGrid } from '@/components'
import { queryList as queryAppointments } from '@/services/calendar'
import Authorized from '@/utils/Authorized'
import { LoadingWrapper } from '@/components/_medisys'
import { APPOINTMENT_STATUSOPTIONS } from '@/utils/constants'
import { futureApptTableParams, previousApptTableParams } from './variables'

const styles = theme => ({
  gridRow: {
    marginTop: theme.spacing(1),
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    height: 'calc(100vh - 80px)',
  },
})

@connect(({ patient, user, codetable }) => ({
  patient: patient.entity || {},
  user,
  appointmentTypes: codetable.ctappointmenttype,
  ctcalendarresource: codetable.ctcalendarresource,
}))
class AppointmentHistory extends PureComponent {
  state = {
    height: 100,
    previousAppt: [],
    futureAppt: [],
    patientProfileFK: undefined,
    loadingAppt: false,
  }

  componentDidMount() {
    this.resize()
    window.addEventListener('resize', this.resize.bind(this))
    if (this.props.patient && this.props.patient.id > 0) {
      this.getAppts(this.props.patient.id)
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize.bind(this))
  }

  async getAppts(patientId) {
    this.setState({ loadingAppt: true })
    try {
      const { user, dispatch, ctcalendarresource } = this.props
      const commonParams = {
        combineCondition: 'and',
        sorting: [{ columnName: 'appointmentDate', direction: 'desc' }],
      }

      const viewOtherApptAccessRight = Authorized.check(
        'appointment.viewotherappointment',
      )

      let doctor
      if (
        !viewOtherApptAccessRight ||
        viewOtherApptAccessRight.rights !== 'enable'
      ) {
        const calendarresource = ctcalendarresource.find(
          resource =>
            resource.isActive &&
            resource.clinicianProfileDto?.id === user.data.clinicianProfile.id,
        )
        if (calendarresource) {
          doctor = calendarresource.id
        }
      }

      await dispatch({
        type: 'codetable/fetchCodes',
        payload: {
          code: 'ltappointmentstatus',
        },
      })

      // const future = undefined
      const [previous, future] = await Promise.all([
        queryAppointments({
          apiCriteria: {
            // appStatus: [
            //   APPOINTMENT_STATUS.CANCELLED,
            //   APPOINTMENT_STATUS.TURNEDUP,
            //   APPOINTMENT_STATUS.TURNEDUPLATE,
            //   // APPOINTMENT_STATUS.NOSHOW,
            // ].join(),
            apptDateTo: moment()
              .add(-1, 'd')
              .formatUTC(),
            patientProfileId: patientId,
            doctor,
            isIncludeHistory: true,
            isIncludeRescheduledByClinic: false,
          },
          ...commonParams,
        }),
        queryAppointments({
          apiCriteria: {
            apptDateFrom: moment().formatUTC(),
            isIncludeHistory: true,
            isIncludeRescheduledByClinic: false,
            // appStatus: [
            //   APPOINTMENT_STATUS.CONFIRMED,
            //   APPOINTMENT_STATUS.RESCHEDULED,
            //   APPOINTMENT_STATUS.PFA_RESCHEDULED,
            // ].join(),
            patientProfileId: patientId,
            doctor,
          },
          ...commonParams,
        }),
      ])
      let previousAppt = []
      let futureAppt = []
      if (previous) {
        const { status, data } = previous
        if (status === '200') previousAppt = this.reBuildApptDatas(data.data)
      }

      if (future) {
        const { status, data } = future
        if (status === '200') futureAppt = this.reBuildApptDatas(data.data)
      }
      this.setState({
        futureAppt,
        previousAppt,
        patientProfileFK: patientId,
        loadingAppt: false,
      })
    } catch (error) {
      this.setState({ loadingAppt: false })
    }
  }

  async UNSAFE_componentWillReceiveProps(nextProps) {
    const { patient } = nextProps

    if (this.state.patientProfileFK !== patient.id && patient.id > 0) {
      this.setState({
        patientProfileFK: patient.id,
      })
      await this.getAppts(patient.id)
    }
  }

  resize() {
    if (this.divElement) {
      const height = this.divElement.clientHeight
      if (height > 0) {
        this.setState({ height: height > 0 ? height / 2 - 144 : 300 })
      }
    }
  }

  reBuildApptDatas(data) {
    return data.map(o => {
      const firstAppointment = _.orderBy(
        o.appointment_Resources,
        ['sortOrder'],
        ['asc'],
      )[0]
      let startTime = ''
      let calendarResourceFK = 0
      let { appointmentDate } = o

      if (firstAppointment) {
        startTime = moment(firstAppointment.startTime, 'HH:mm:ss').format(
          'hh:mm A',
        )
        calendarResourceFK = firstAppointment.calendarResourceFK
        appointmentDate = `${moment(o.appointmentDate).format(
          'YYYY-MM-DD',
        )} ${moment(firstAppointment.startTime, 'HH:mm:ss').format('HH:mm:ss')}`
      }
      const apptStatusId = parseInt(o.appointmentStatusFk, 10)
      const apptStatus = APPOINTMENT_STATUSOPTIONS.find(
        m => m.id === apptStatusId,
      )

      const newRow = {
        ...o,
        appointmentDate,
        startTime,
        calendarResourceFK,
        appointmentStatus: apptStatus ? apptStatus.name || '' : '',
        appointmentStatusFk: apptStatusId,
        appointmentRemarks: o.appointmentRemarks || '',
      }
      return newRow
    })
  }

  render() {
    const {
      classes,
      theme,
      handleRowDoubleClick,
      appointmentTypes,
      handleCopyAppointmentClick,
    } = this.props
    const { previousAppt, futureAppt, loadingAppt } = this.state

    return (
      <LoadingWrapper loading={loadingAppt} text='loading...'>
        <div>
          <CardContainer hideHeader size='sm'>
            <h4>Current & Future Appointment</h4>

            <CommonTableGrid
              size='sm'
              rows={futureAppt}
              onRowDoubleClick={handleRowDoubleClick}
              {...futureApptTableParams(appointmentTypes)}
              FuncProps={{
                pager: true,
                pagerDefaultState: {
                  pagesize: 10,
                },
              }}
            />

            <h4
              style={{
                marginTop: theme.spacing(2),
              }}
            >
              Previous Appointment
            </h4>
            <CommonTableGrid
              size='sm'
              rows={previousAppt}
              {...previousApptTableParams(
                appointmentTypes,
                handleCopyAppointmentClick,
              )}
              FuncProps={{
                pager: true,
                pagerDefaultState: {
                  pagesize: 10,
                },
              }}
            />
          </CardContainer>
        </div>
      </LoadingWrapper>
    )
  }
}

export default withStyles(styles, {
  withTheme: true,
  name: 'AppointmentHistory',
})(AppointmentHistory)
