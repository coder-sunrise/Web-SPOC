import moment from 'moment'
import { filterMap } from './variables'

export const filterData = (filter, data = []) => {
  let newData = data.filter((eachRow) => {
    return filterMap[filter].includes(eachRow.visitStatus)
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
    target: eventDate.format(),
    today: today.format(),
  })
  return today.diff(eventDate, 'days') === 0
}
