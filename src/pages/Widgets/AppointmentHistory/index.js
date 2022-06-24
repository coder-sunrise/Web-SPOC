import React, { PureComponent } from 'react'
import moment from 'moment'
import { connect } from 'dva'
import $ from 'jquery'
import { withStyles } from '@material-ui/core'
import {
  CardContainer,
  CommonTableGrid,
  GridContainer,
  GridItem,
  Checkbox,
} from '@/components'

import { APPOINTMENT_STATUSOPTIONS } from '@/utils/constants'
import { queryList as queryAppointments } from '@/services/calendar'
import Authorized from '@/utils/Authorized'
import { previousApptTableParams } from './variables'

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

@connect(({ patient, user, global, codetable }) => ({
  patient: patient.entity || {},
  user,
  mainDivHeight: global.mainDivHeight,
  appointmentTypes: codetable.ctappointmenttype,
  ctcalendarresource: codetable.ctcalendarresource,
}))
class AppointmentHistory extends PureComponent {
  state = {
    previousAppt: [],
    patientProfileFK: undefined,
  }

  componentDidMount() {
    if (this.props.patient && this.props.patient.id > 0) {
      this.getAppts(this.props.patient.id, false)
    }
  }

  async getAppts(patientId, showRecheduledByClinic) {
    const { user, dispatch } = this.props
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

    const [previous] = await Promise.all([
      queryAppointments({
        apiCriteria: {
          isIncludeHistory: true,
          isIncludeRescheduledByClinic: showRecheduledByClinic,
          patientProfileId: patientId,
          doctor,
        },
        ...commonParams,
      }),
    ])

    let previousAppt = []

    if (previous) {
      const { status, data } = previous
      if (status === '200') previousAppt = this.reBuildApptDatas(data.data)
    }
    this.setState({
      previousAppt,
      patientProfileFK: patientId,
    })
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

  toggleShowRecheduledByClinic = e => {
    this.getAppts(this.props.patient.id, e.target.value)
  }

  render() {
    const { previousAppt } = this.state
    const { mainDivHeight = 700 } = this.props
    let height = mainDivHeight - 310
    if (height < 300) height = 300

    return (
      <CardContainer hideHeader size='sm'>
        <GridContainer>
          <GridItem xs={12}>
            <Checkbox
              simple
              label='Show Rescheduled by Clinic'
              onChange={this.toggleShowRecheduledByClinic}
            />
          </GridItem>
          <GridItem xs={12}>
            <CommonTableGrid
              size='sm'
              TableProps={{
                height,
              }}
              rows={previousAppt}
              {...previousApptTableParams(this.props.appointmentTypes)}
            />
          </GridItem>
        </GridContainer>
      </CardContainer>
    )
  }
}

export default withStyles(styles, {
  withTheme: true,
  name: 'AppointmentHistory',
})(AppointmentHistory)
