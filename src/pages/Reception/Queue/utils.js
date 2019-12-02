import moment from 'moment'
import { dateFormatLong, timeFormat } from '@/components'
import { filterMap } from './variables'

const dateTimeFormat = `${dateFormatLong} ${timeFormat}`

export const formatAppointmentTimes = (values = []) =>
  values.map((value) => moment(value, 'HH:mm:ss').format('hh:mm A'))
// moment(value, 'HH:mm:ss').format(dateTimeFormat)

export const filterData = (filter, data = [], searchQuery = '') => {
  let newData = data.filter((eachRow) => {
    if (searchQuery === '')
      return filterMap[filter].includes(eachRow.visitStatus)

    return (
      filterMap[filter].includes(eachRow.visitStatus) &&
      eachRow.patientName.toLowerCase().indexOf(searchQuery.toLowerCase()) >= 0
    )
  })
  return newData
}

export const filterDoctorBlock = (data) => {
  return data.filter(
    (eachRow) => eachRow.isDoctorEvent === undefined || !eachRow.isDoctorEvent,
  )
}

export const getCount = (type, data) => {
  const filteredData = filterData(type, data)
  return filteredData.length
}

export const todayOnly = (event) => {
  const eventDate = !event.isDoctorEvent
    ? moment(event.appointmentDate)
    : moment(event.eventDate)
  const today = moment()
  console.log({
    diff: today.diff(eventDate, 'days'),
    target: eventDate.formatUTC(),
    today: today.formatUTC(),
  })
  return today.diff(eventDate, 'days') === 0
}
