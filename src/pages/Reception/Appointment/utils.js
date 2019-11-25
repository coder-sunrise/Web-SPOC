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

export const constructClinicBreakHoursData = (breakHoursList) => {
  const result = breakHoursList.reduce((breakHoursMap, breakHour) => {
    return [
      ...breakHoursMap,
      {
        displayValue: breakHour.displayValue,
        startDate: breakHour.effectiveStartDate,
        endDate: breakHour.effectiveEndDate,
        0: { to: breakHour.sunToBreak, from: breakHour.sunFromBreak },
        1: { to: breakHour.monToBreak, from: breakHour.monFromBreak },
        2: { to: breakHour.tueToBreak, from: breakHour.tueFromBreak },
        3: { to: breakHour.wedToBreak, from: breakHour.wedFromBreak },
        4: { to: breakHour.thursToBreak, from: breakHour.thursFromBreak },
        5: { to: breakHour.friToBreak, from: breakHour.friFromBreak },
        6: { to: breakHour.satToBreak, from: breakHour.satFromBreak },
      },
    ]
  }, [])
  return result
}

export const isSavePayloadOk = (payload) => {
  console.log({ payload })
  return false
}
