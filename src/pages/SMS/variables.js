import moment from 'moment'
import Grid from './Grid'
import {
  DateFormatter,
  dateFormatLong,
  timeFormat24HourWithSecond,
  timeFormatSmallCase,
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
  { name: 'lastSMSSendDate', title: 'Last SMS Sent' },
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
    columnName: 'upcomingAppointmentDate',
    width: 190,
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
    columnName: 'appointmentType',
    sortingEnabled: false,
    render: (row) => {
      return row.appointmentTypes ? row.appointmentTypes.join(', ') : null
    },
  },
  {
    columnName: 'lastVisitDate',
    width: 190,
    render: (row) =>
      DateFormatter({
        value: row.lastVisitDate,
        full: true,
      }),
  },
  {
    columnName: 'lastSMSSendStatus',
    sortBy:
      'AppointmentReminder.PatientOutgoingSMSNavigation.OutgoingSMSFKNavigation.StatusFkNavigation.displayValue',
  },
  {
    columnName: 'lastSMSSendDate',
    width: 190,
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
    sortBy: 'Visit.DoctorProfileFkNavigation.ClinicianProfile.Name',
  },
  {
    columnName: 'lastVisitDate',
    width: 190,
    sortBy: 'Visit.VisitDate',
    render: (row) =>
      DateFormatter({
        value: row.lastVisitDate,
        full: true,
      }),
  },
  {
    columnName: 'lastSMSSendStatus',
    sortBy:
      'PatientOutgoingSMS.OutgoingSMSFKNavigation.StatusFkNavigation.displayValue',
  },
  {
    columnName: 'lastSMSSendDate',
    width: 190,
    sortBy: 'PatientOutgoingSMS.OutgoingSMSFKNavigation.SendDate',
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
