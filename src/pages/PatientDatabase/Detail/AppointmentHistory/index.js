import React, { PureComponent } from 'react'
import moment from 'moment'
// dva
import { connect } from 'dva'
// material ui
import { withStyles } from '@material-ui/core'
// common components
import {
  CodeSelect,
  GridContainer,
  GridItem,
  CommonTableGrid,
  dateFormatLong,
} from '@/components'
import { APPOINTMENT_STATUS } from '@/utils/constants'
// services
import { queryList as queryAppointments } from '@/services/calendar'

const styles = (theme) => ({
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

const commonExt = [
  {
    columnName: 'appointmentStatusFk',
    type: 'codeSelect',
    code: 'ltappointmentstatus',
  },
  {
    columnName: 'appointmentDate',
    format: dateFormatLong,
    type: 'date',
  },
  {
    columnName: 'startTime',
    type: 'time',
    sortingEnabled: false,
  },
  {
    columnName: 'doctor',
    type: 'codeSelect',
    code: 'clinicianprofile',
    valueField: 'id',
    labelField: 'name',
  },
]

@connect(({ patient }) => ({
  patient: patient.entity || {},
}))
class AppointmentHistory extends PureComponent {
  state = {
    height: 100,
    previousAppt: [],
    futureAppt: [],
    patientProfileFK: undefined,
  }

  previousApptTableParams = {
    columns: [
      { name: 'appointmentDate', title: 'Date' },
      { name: 'startTime', title: 'Time' },
      { name: 'doctor', title: 'Doctor' },
      { name: 'appointmentStatusFk', title: 'Status' },
      { name: 'cancellationReason', title: 'Reason' },
      { name: 'appointmentRemarks', title: 'Remarks' },
    ],
    columnExtensions: [
      ...commonExt,
    ],
  }

  futureApptTableParams = {
    columns: [
      { name: 'appointmentDate', title: 'Date' },
      { name: 'startTime', title: 'Time' },
      { name: 'doctor', title: 'Doctor' },
      { name: 'appointmentStatusFk', title: 'Status' },
      { name: 'appointmentRemarks', title: 'Remarks' },
    ],
    columnExtensions: [
      ...commonExt,
    ],
  }

  componentDidMount () {
    this.resize()
    window.addEventListener('resize', this.resize.bind(this))
    if (this.props.patient && this.props.patient.id > 0) {
      this.getAppts(this.props.patient.id)
    }
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.resize.bind(this))
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    const { patient } = nextProps

    if (this.state.patientProfileFK !== patient.id && patient.id > 0) {
      this.getAppts(patient.id)
    }
  }

  async getAppts (patientId) {
    const commonParams = {
      combineCondition: 'and',
      sorting: [
        { columnName: 'appointmentDate', direction: 'asc' },
      ],
      'AppointmentGroupFKNavigation.patientProfileFK': patientId,
    }
    const [
      previous,
      future,
    ] = await Promise.all([
      queryAppointments({
        in_appointmentStatusFk: [
          APPOINTMENT_STATUS.CANCELLED,
          APPOINTMENT_STATUS.TURNEDUP,
          APPOINTMENT_STATUS.NOSHOW,
        ].join('|'),
        ...commonParams,
      }),
      queryAppointments({
        in_appointmentStatusFk: [
          APPOINTMENT_STATUS.SCHEDULED,
          APPOINTMENT_STATUS.RESCHEDULED,
        ].join('|'),
        ...commonParams,
      }),
    ])
    if (previous) {
      const { status, data } = previous
      if (status === '200')
        this.setState({
          previousAppt: this.reBuildApptDatas(data.data),
          patientProfileFK: patientId,
        })
    }

    if (future) {
      const { status, data } = future
      if (status === '200')
        this.setState({
          futureAppt: this.reBuildApptDatas(data.data),
          patientProfileFK: patientId,
        })
    }
  }

  resize () {
    if (this.divElement) {
      const height = this.divElement.clientHeight
      if (height > 0) {
        this.setState({ height: height > 0 ? height / 2 - 144 : 300 })
      }
    }
  }

  reBuildApptDatas (data) {
    return data.map((o) => {
      const firstAppointment = o.appointment_Resources.find(
        (item) => item.sortOrder === 0,
      )
      let startTime = ''
      let doctor = 0
      let { appointmentDate } = o

      if (firstAppointment) {
        startTime = moment(firstAppointment.startTime, 'HH:mm:ss').format(
          'hh:mm A',
        )
        doctor = firstAppointment.clinicianFK
        appointmentDate = `${moment(o.appointmentDate).format(
          'YYYY-MM-DD',
        )} ${moment(firstAppointment.startTime, 'HH:mm:ss').format('HH:mm:ss')}`
      }

      const newRow = {
        ...o,
        appointmentDate,
        startTime,
        doctor,
        appointmentStatusFk: parseInt(o.appointmentStatusFk, 10),
        appointmentRemarks: o.appointmentRemarks || '',
      }
      return newRow
    })
  }

  render () {
    const { classes, theme } = this.props
    const { previousAppt, futureAppt } = this.state
    // this.resize()
    return (
      <div>
        <h4 style={{ marginTop: 20 }}>Previous Appointment</h4>

        <CommonTableGrid
          size='sm'
          rows={previousAppt}
          {...this.previousApptTableParams}
        />
        <h4
          style={{
            marginTop: theme.spacing(2),
          }}
        >
          Current & Future Appointment
        </h4>
        <CommonTableGrid
          size='sm'
          rows={futureAppt}
          {...this.futureApptTableParams}
        />
      </div>

      // <GridContainer>
      //   <GridItem xs md={12}>
      //     <React.Fragment>
      //       <h4 style={{ marginTop: 20 }}>Previous Appointment</h4>

      //       <CommonTableGrid
      //         size='sm'
      //         rows={previousAppt}
      //         {...this.previousApptTableParams}
      //       />
      //     </React.Fragment>
      //   </GridItem>
      //   <GridItem xs md={12}>
      //     <React.Fragment>
      //       <h4
      //         style={{
      //           marginTop: theme.spacing(2),
      //         }}
      //       >
      //         Current & Future Appointment
      //       </h4>
      //       <CommonTableGrid
      //         size='sm'
      //         rows={futureAppt}
      //         {...this.futureApptTableParams}
      //       />
      //     </React.Fragment>
      //   </GridItem>
      // </GridContainer>
    )
  }
}

export default withStyles(styles, {
  withTheme: true,
  name: 'AppointmentHistory',
})(AppointmentHistory)
