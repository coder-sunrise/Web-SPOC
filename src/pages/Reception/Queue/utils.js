import moment from 'moment'
import { filterMap } from './variables'
import { sendNotification } from '@/utils/realtime'
import { NOTIFICATION_TYPE, NOTIFICATION_STATUS } from '@/utils/constants'

export const formatAppointmentTimes = (values = []) =>
  values.map(value => moment(value, 'HH:mm:ss').format('hh:mm A'))
// moment(value, 'HH:mm:ss').format(dateTimeFormat)

export const filterData = (
  filter,
  data = [],
  searchQuery = '',
  visitType = [],
  doctor = [],
  room = [],
) => {
  let newData = data.filter(eachRow => {
    return (
      filterMap[filter].includes(eachRow.visitStatus) &&
      (searchQuery === '' ||
        (eachRow.patientName || '')
          .toLowerCase()
          .indexOf(searchQuery.toLowerCase()) >= 0 ||
        (eachRow.patientReferenceNo || '')
          .toLowerCase()
          .indexOf(searchQuery.toLowerCase()) >= 0 ||
        (eachRow.patientAccountNo || '')
          .toLowerCase()
          .indexOf(searchQuery.toLowerCase()) >= 0 ||
        (eachRow.patientMobile || '')
          .toLowerCase()
          .indexOf(searchQuery.toLowerCase()) >= 0) &&
      (visitType.length === 0 ||
        visitType.indexOf(-99) >= 0 ||
        visitType.indexOf(eachRow.visitPurposeFK) >= 0) &&
      (doctor.length === 0 ||
        doctor.indexOf(-99) >= 0 ||
        eachRow.visitDoctor.find(
          doc => doctor.indexOf(doc.doctorProfileFK) > -1,
        )) &&
      (room.length === 0 ||
        room.indexOf(-99) >= 0 ||
        room.indexOf(eachRow.roomFK) >= 0)
    )
  })
  return newData
}

export const filterDoctorBlock = data => {
  return data.filter(
    eachRow => eachRow.isDoctorEvent === undefined || !eachRow.isDoctorEvent,
  )
}

export const getCount = (type, data) => {
  const filteredData = filterData(type, data)
  return filteredData.length
}

export const todayOnly = event => {
  const eventDate = !event.isDoctorEvent
    ? moment(event.appointmentDate)
    : moment(event.eventDate)
  const today = moment()
  return today.diff(eventDate, 'days') === 0
}

export const sendQueueNotification = data => {
  sendNotification('QueueListing', {
    type: NOTIFICATION_TYPE.QUEUE,
    status: NOTIFICATION_STATUS.OK,
    ...data,
  })
}
