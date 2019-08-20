import moment from 'moment'
import {
  serverDateFormat,
  timeFormat,
  timeFormatWithoutSecond,
} from '@/components'
import { initialAptInfo } from './variables'

// export const handleSubmit = (values, { props, resetForm }) => {
//   const {
//     patientName,
//     contactNo,
//     startDate: _utcStartDate,
//     endDate: _utcEndDate,
//     startTime,
//     endTime,
//     appointmentType = '',
//     doctor,
//   } = values
//   const { handleAddEvents, handleUpdateEvents, slotInfo, resources } = props
//   const longDateTimeFormat = 'DD-MM-YYYY'
//   const startDate = moment(_utcStartDate).format(_dateFormat)
//   const endDate = moment(_utcEndDate).format(_dateFormat)

//   const _momentStartDate = moment(
//     `${startDate} ${startTime}`,
//     `${_dateFormat} hh:mm a`,
//   )
//   const _nativeStartDate = _momentStartDate.toDate()

//   const _momentEndDate = moment(
//     `${endDate} ${endTime}`,
//     `${_dateFormat} hh:mm a`,
//   )
//   const _nativeEndDate = _momentEndDate.toDate()

//   const assignedResource = resources.find(
//     (resource) => resource.resourceId === doctor,
//   )
//   let resourceId = assignedResource ? assignedResource.resourceId : 'other'

//   if (!_momentStartDate.isValid() && !_momentEndDate.isValid()) return

//   const event = {
//     ...slotInfo,
//     ...values,
//     tooltip: `${patientName}(${contactNo})`,
//     start: _nativeStartDate,
//     end: _nativeEndDate,
//     title: `${patientName}(${contactNo})`,
//     color: getColorByAppointmentType(appointmentType),
//     resourceId,
//   }

//   switch (slotInfo.type) {
//     case 'update':
//       handleUpdateEvents(event)
//       break
//     default:
//       handleAddEvents(event)
//       break
//   }
//   resetForm()
// }

const initDailyRecurrence = {
  recurrencePatternFK: 1,
  recurrenceFrequency: 1,
  recurrenceDayOfTheMonth: 1,
  recurrenceDaysOfTheWeek: '',
  recurrenceRange: '',
  recurrenceCount: 1,
  recurrenceEndDate: '2019-07-15T10:05:29.4405139+08:00',
}

export const mapPropsToValues = ({
  selectedAppointmentID,
  selectedSlot,
  events,
  user,
}) => {
  const appointment = events.find((item) => item.id === selectedAppointmentID)
  if (appointment) {
    const {
      id,
      bookedByUserFk,
      isEnableRecurrence,
      patientName,
      patientContactNo,
      patientProfileFk,
      appointmentStatusFk,
      appointmentRemarks,
    } = appointment
    const appointmentDate = moment(appointment.appointmentDate).toDate()

    return {
      id,
      bookedByUserFK: bookedByUserFk,
      isEnableRecurrence,
      patientName,
      patientContactNo,
      patientProfileFK: patientProfileFk,
      appointmentDate,
      appointmentStatusFk,
      appointmentRemarks,
    }
  }

  return {
    id: undefined,
    isEnableRecurrence: false,
    bookedByUserFK: user.userProfileFK,
    bookedByUser: user.name,
    appointmentDate: selectedSlot.start,
  }
  // return {
  //   ...initialAptInfo,

  //   // ...slotInfo,
  //   recurrenceDto: { ...initDailyRecurrence },
  //   appointmentDate: slotInfo.start,
  //   // startDate,
  //   // startTime,
  //   // endDate,
  //   // endTime,
  //   bookedByUserFK: user ? user.userProfileFK : '',
  //   bookedByUserName: user ? user.name : '',
  //   appointments: [],
  // }
}

export const getEventSeriesByID = (appointmentID, data) => {
  const appointment = data.find((item) => item.id === appointmentID)
  if (appointment) {
    const { appointment_Resources: apptResources } = appointment
    return apptResources
  }
  return []
  // if (!data && !appointmentID) return []

  // const appointment = data.find(
  //   (eachData) => eachData._appointmentID === appointmentID,
  // )

  // if (!appointment) return []

  // const appointmentDataGrid = appointment.appointmentResources.map(
  //   (resource, index) => ({
  //     ...resource,
  //     id: `${appointmentID}-resource-${index}`,
  //     timeFrom: resource.start,
  //     timeTo: resource.end,
  //   }),
  // )
  // console.log({ appointmentDataGrid })
  // return appointmentDataGrid
}

export const parseDateToServerDateFormatString = (date, format) => {
  if (moment.isMoment(date)) return date.format(serverDateFormat)

  if (format) {
    if (moment(date, format).isValid())
      return moment(date, format).format(serverDateFormat)

    return date
  }

  if (moment(date).isValid()) return moment(date).format(serverDateFormat)

  return date
}

export const mapDatagridToAppointmentResources = (event, index) => {
  const {
    startTime: timeFrom,
    endTime: timeTo,
    clinicianFK,
    isPrimaryClinician,
    roomFk,
  } = event
  const startTime = moment(timeFrom, timeFormatWithoutSecond).format(timeFormat)
  const endTime = moment(timeTo, timeFormatWithoutSecond).format(timeFormat)
  return {
    clinicianFK,
    isPrimaryClinician,
    roomFk,
    startTime,
    endTime,
    sortOrder: index,
    isDeleted: false,
  }
}
