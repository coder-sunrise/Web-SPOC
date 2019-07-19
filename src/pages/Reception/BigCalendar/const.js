import * as Yup from 'yup'

export const timeFormat = 'hh:mm a'

const _modelKey = 'calendar/'

export const CalendarActions = {
  MoveEvent: `${_modelKey}moveEvent`,
  AddEventSeries: `${_modelKey}addEventSeries`,
  UpdateEventByEventID: `${_modelKey}updateEventSeriesByEventID`,
  DeleteEventByEventID: `${_modelKey}deleteEventSeriesByEventID`,
  UpdateDoctorEvent: `${_modelKey}updateDoctorEvent`,
}

export const SeriesAlert = {
  0: 'single',
  1: 'series',
}

export const DoctorFormValidation = Yup.object().shape({
  doctor: Yup.string().required(),
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

  // filter by doctor
  const { doctors } = filter
  if (doctors.length !== 0 && !doctors.includes('all'))
    returnData = returnData.filter((aptData) =>
      doctors.includes(aptData.doctor),
    )

  // filter by appointment type
  const { appointmentType } = filter
  if (appointmentType.length !== 0 && !appointmentType.includes('all')) {
    returnData = returnData.filter((aptData) =>
      appointmentType.includes(aptData.appointmentType),
    )
  }
  // filter by query
  const { searchQuery } = filter
  if (searchQuery !== '') {
    returnData = returnData.filter((aptData) => {
      const { patientName } = aptData
      if (patientName.toLowerCase().includes(searchQuery.toLowerCase()))
        return true

      return false
    })
  }

  return returnData
}
