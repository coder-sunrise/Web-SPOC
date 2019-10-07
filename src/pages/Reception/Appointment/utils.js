import * as Yup from 'yup'
import { primaryColor } from 'mui-pro-jss'

export const defaultColorOpts = {
  name: 'default',
  value: primaryColor,
  active: primaryColor,
}

export const doctorEventColorOpts = {
  name: 'doctorEvent',
  value: '#999',
  active: '#8c8c8c',
}

export const timeFormat = 'hh:mm a'

export const SeriesAlert = {
  0: 'single',
  1: 'series',
}

export const DoctorFormValidation = Yup.object().shape({
  doctorBlockUserFk: Yup.string().required(),
  durationHour: Yup.string().required(),
  durationMinute: Yup.string().required(),
  eventDate: Yup.string().required(),
  eventTime: Yup.string().required(),
})

export const InitialPopoverEvent = {
  startTime: '',
  endTime: '',
  patientName: '',
  contactNo: '',
}

export const applyFilter = (data, filter) => {
  let returnData = [
    ...data,
  ]
  const { doctors, appointmentType, searchQuery } = filter
  const filterByDoctor = (aptData) => doctors.includes(aptData.doctor)

  const filterByAppointmentType = (aptData) =>
    appointmentType.includes(aptData.appointmentType)

  const filterBySearchQuery = (aptData) => {
    const { patientName } = aptData
    if (patientName !== undefined)
      return patientName.toLowerCase().includes(searchQuery.toLowerCase())
    return false
  }
  // returnData = returnData
  //   .filter(filterByDoctor)
  //   .filter(filterByAppointmentType)
  //   .filter(filterBySearchQuery)

  if (doctors.length !== 0 && !doctors.includes('all'))
    returnData = returnData.filter(filterByDoctor)

  if (appointmentType.length !== 0 && !appointmentType.includes('all')) {
    returnData = returnData.filter(filterByAppointmentType)
  }

  if (searchQuery !== '') {
    returnData = returnData.filter(filterBySearchQuery)
  }

  return returnData
}
