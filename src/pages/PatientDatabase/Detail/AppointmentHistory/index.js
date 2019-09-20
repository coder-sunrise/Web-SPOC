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
  serverDateFormat,
  dateFormatLong,
} from '@/components'
// services
import { queryList as queryAppointments } from '@/services/calendar'
// utils
import { formatAppointmentTimes } from '@/pages/Reception/Queue/utils'

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
    render: (rows) => (
      <CodeSelect
        code='ltappointmentstatus'
        text
        value={parseInt(rows.appointmentStatusFk, 10)}
      />
    ),
  },
  {
    columnName: 'appointmentDate',
    render: (rows) => moment(rows.appointmentDate).format(dateFormatLong),
  },
  {
    columnName: 'startTime',
    render: (rows) => {
      const firstAppointment = rows.appointment_Resources.find(
        (item) => item.sortOrder === 0,
      )
      if (firstAppointment) {
        return moment(firstAppointment.startTime, 'HH:mm:ss').format('hh:mm A')
      }
      return ''
    },
  },
  {
    columnName: 'doctor',
    render: (rows) => {
      const firstAppointment = rows.appointment_Resources.find(
        (item) => item.sortOrder === 0,
      )
      if (firstAppointment) {
        return (
          <CodeSelect
            text
            code='clinicianprofile'
            value={firstAppointment.clinicianFK}
            labelField='name'
            valueField='id'
          />
        )
      }
      return ''
    },
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
    if (this.props.patient.id) {
      this.getAppts()
    }
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.resize.bind(this))
  }

  async getAppts () {
    const today = moment().format(serverDateFormat)
    const commonParams = {
      combineCondition: 'and',
      isCancelled: false,
      neql_appointmentStatusFk: '2',
      sorting: [
        { columnName: 'appointmentDate', direction: 'asc' },
      ],
      'AppointmentGroupFKNavigation.patientProfileFK': this.props.patient.id,
    }
    const [
      previous,
      future,
    ] = await Promise.all([
      queryAppointments({
        lst_appointmentDate: today,
        ...commonParams,
      }),
      queryAppointments({
        lgteql_appointmentDate: today,
        ...commonParams,
      }),
    ])
    if (previous) {
      const { status, data } = previous
      if (status === '200')
        this.setState({
          previousAppt: data.data,
        })
    }

    if (future) {
      const { status, data } = future
      if (status === '200')
        this.setState({
          futureAppt: data.data,
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

  render () {
    const { classes, schemes, payers, dispatch } = this.props
    const { height, previousAppt, futureAppt } = this.state
    let list = []

    return (
      <GridContainer>
        <GridItem md={12}>
          <h4 style={{ marginTop: 20 }}>Previous Appointment</h4>
        </GridItem>
        <GridItem md={12} className={classes.gridRow}>
          <CommonTableGrid
            rows={previousAppt}
            {...this.previousApptTableParams}
          />
        </GridItem>
        <GridItem md={12}>
          <h4 style={{ marginTop: 20 }}>Current & Future Appointment</h4>
        </GridItem>
        <GridItem md={12} className={classes.gridRow}>
          <CommonTableGrid rows={futureAppt} {...this.futureApptTableParams} />
        </GridItem>
      </GridContainer>
    )
  }
}

export default withStyles(styles, {
  withTheme: true,
  name: 'AppointmentHistory',
})(AppointmentHistory)
