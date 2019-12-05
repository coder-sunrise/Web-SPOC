import moment from 'moment'
import Grid from './Grid'
import {
  DateFormatter,
  dateFormatLong,
  timeFormat24HourWithSecond,
  timeFormatSmallCase,
  Tooltip,
} from '@/components'

const appointmentColumns = [
  { name: 'patientName', title: 'Patient Name' },
  { name: 'patientContactNo', title: 'Contact No' },
  { name: 'upcomingAppointmentDate', title: 'Upcoming Appt.' },
  { name: 'appointmentRemarks', title: 'Appt. Remarks' },
  { name: 'doctor', title: 'Doctor' },
  { name: 'appointmentStatus', title: 'Appt. Status' },
  { name: 'appointmentType', title: 'Appt. Type' },
  { name: 'lastVisitDate', title: 'Last Visit Date' },
  { name: 'lastSMSSendStatus', title: 'Last SMS Status' },
  { name: 'lastSMSSentDate', title: 'Last SMS Sent' },
  { name: 'isReminderSend', title: 'Reminder Sent' },
  { name: 'Action', title: 'Action' },
]

const patientColumns = [
  { name: 'patientName', title: 'Patient Name' },
  { name: 'patientContactNo', title: 'Contact No' },
  { name: 'doctor', title: 'Doctor' },
  { name: 'lastVisitDate', title: 'Last Visit Date' },
  { name: 'lastSMSSendStatus', title: 'Last SMS Status' },
  { name: 'lastSMSSentDate', title: 'Last SMS Sent' },
  { name: 'Action', title: 'Action' },
]

const appointmentColumnsExtensions = [
  {
    columnName: 'patientName',
    sortBy: 'AppointmentGroupFKNavigation.PatientProfileFKNavigation.Name',
  },
  {
    columnName: 'patientContactNo',
    sortingEnabled: false,
  },
  {
    columnName: 'upcomingAppointmentDate',
    width: 190,
    sortingEnabled: false,
    render: (row) => {
      const { upcomingAppointmentDate, upcomingAppointmentStartTime } = row
      return `${moment(upcomingAppointmentDate).format(
        dateFormatLong,
      )} ${moment(
        upcomingAppointmentStartTime,
        timeFormat24HourWithSecond,
      ).format(timeFormatSmallCase)} `
    },
  },
  {
    columnName: 'appointmentRemarks',
    sortingEnabled: false,
  },
  {
    columnName: 'doctor',
    sortingEnabled: false,
    // sortBy: 'Appointment_Resources.ClinicianFKNavigation.Name',
  },
  {
    columnName: 'appointmentStatus',
    sortBy: 'AppointmentStatusFkNavigation.displayValue',
  },
  {
    columnName: 'appointmentType',
    sortingEnabled: false,
    render: (row) => {
      const apptType = row.appointmentTypes
        ? row.appointmentTypes.join(', ')
        : null
      return (
        <Tooltip title={apptType}>
          <span>{apptType}</span>
        </Tooltip>
      )
    },
  },
  {
    columnName: 'lastVisitDate',
    sortingEnabled: false,
    type: 'date',
    // sortBy:
    //   'AppointmentGroupFKNavigation.PatientProfileFKNavigation.Visit.VisitDate',
  },
  {
    columnName: 'lastSMSSendStatus',
    sortingEnabled: false,
    // sortBy:
    //   'AppointmentReminders.PatientOutgoingSMSNavigation.OutgoingSMSFKNavigation.StatusFkNavigation.displayValue',
  },
  {
    columnName: 'lastSMSSentDate',
    width: 190,
    sortingEnabled: false,
    // sortBy:
    //   'AppointmentReminders.PatientOutgoingSMSNavigation.OutgoingSMSFKNavigation.SendDate',
    render: (row) =>
      DateFormatter({
        value: row.lastSMSSendDate,
        full: true,
      }),
  },
  {
    columnName: 'isReminderSend',
    sortBy: 'IsReminderSent',
  },
  {
    columnName: 'Action',
    width: 100,
    align: 'center',
    sortingEnabled: false,
  },
]

const patientColumnsExtensions = [
  {
    columnName: 'patientName',
    sortBy: 'name',
  },
  {
    columnName: 'patientContactNo',
    sortingEnabled: false,
  },
  {
    columnName: 'doctor',
    sortingEnabled: false,
    // sortBy: 'Visit.DoctorProfileFkNavigation.ClinicianProfile.Name',
  },
  {
    columnName: 'lastVisitDate',
    type: 'date',
    // sortBy: 'Visit.VisitDate',
    sortingEnabled: false,
  },
  {
    columnName: 'lastSMSSendStatus',
    sortingEnabled: false,
    // sortBy:
    //   'PatientOutgoingSMS.OutgoingSMSFKNavigation.StatusFkNavigation.displayValue',
  },
  {
    columnName: 'lastSMSSentDate',
    width: 190,
    // sortBy: 'PatientOutgoingSMS.OutgoingSMSFKNavigation.SendDate',
    sortingEnabled: false,
    render: (row) =>
      DateFormatter({
        value: row.lastSMSSendDate,
        full: true,
      }),
  },
  {
    columnName: 'Action',
    width: 100,
    align: 'center',
    sortingEnabled: false,
  },
]

const appointmentProps = {
  type: 'Appointment',
  columns: appointmentColumns,
  columnsExtensions: appointmentColumnsExtensions,
}

const patientProps = {
  type: 'Patient',
  columns: patientColumns,
  columnsExtensions: patientColumnsExtensions,
}

const addContent = (type, props) => {
  switch (type) {
    case 1:
      return <Grid {...props} {...appointmentProps} />
    case 2:
      return <Grid {...props} {...patientProps} />
    default:
      return <Grid {...props} />
  }
}

export const SmsOption = (detailsProps) => [
  {
    id: 0,
    name: 'Appointment',
    content: addContent(1, detailsProps),
  },
  {
    id: 1,
    name: 'Patient',
    content: addContent(2, detailsProps),
  },
]
