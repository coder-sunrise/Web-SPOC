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

const getDay = (value) => {
  if (value.includes('mon')) return 1
  if (value.includes('tue')) return 2
  if (value.includes('wed')) return 3
  if (value.includes('thurs')) return 4
  if (value.includes('fri')) return 5
  if (value.includes('sat')) return 6
  if (value.includes('sun')) return 0
  return 0
}

const constructObj = ({ value, toSuffix = '', fromSuffix = '' }) => {
  return {
    0: {
      end: value[`sun${toSuffix}`],
      start: value[`sun${fromSuffix}`],
    },
    1: {
      end: value[`mon${toSuffix}`],
      start: value[`mon${fromSuffix}`],
    },
    2: {
      end: value[`tue${toSuffix}`],
      start: value[`tue${fromSuffix}`],
    },
    3: {
      end: value[`wed${toSuffix}`],
      start: value[`wed${fromSuffix}`],
    },
    4: {
      end: value[`thurs${toSuffix}`],
      start: value[`thurs${fromSuffix}`],
    },
    5: {
      end: value[`fri${toSuffix}`],
      start: value[`fri${fromSuffix}`],
    },
    6: {
      end: value[`sat${toSuffix}`],
      start: value[`sat${fromSuffix}`],
    },
  }
}

const appendResult = (result, value) => ({
  ...result,
  0: [
    ...result[0],
    value[0],
  ],
  1: [
    ...result[1],
    value[1],
  ],
  2: [
    ...result[2],
    value[2],
  ],
  3: [
    ...result[3],
    value[3],
  ],
  4: [
    ...result[4],
    value[4],
  ],
  5: [
    ...result[5],
    value[5],
  ],
  6: [
    ...result[6],
    value[6],
  ],
})

const initialObj = {
  0: [],
  1: [],
  2: [],
  3: [],
  4: [],
  5: [],
  6: [],
}

export const mapOperationHour = (operationHourList) => {
  const result = operationHourList.reduce((_result, operationHour) => {
    const value = constructObj({
      value: operationHour,
      fromSuffix: 'FromOpHour',
      toSuffix: 'ToOpHour',
    })
    return appendResult(_result, value)
  }, initialObj)
  return result
}

export const mapBreakHour = (breakHourList) => {
  const result = breakHourList.reduce((_result, breakHour) => {
    const value = constructObj({
      value: breakHour,
      fromSuffix: 'FromBreak',
      toSuffix: 'ToBreak',
    })
    return appendResult(_result, value)
  }, initialObj)
  return result
}

export const isSavePayloadOk = (payload) => {
  console.log({ payload })
  return false
}
