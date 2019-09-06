import moment from 'moment'
import * as Yup from 'yup'
import {
  serverDateFormat,
  timeFormat,
  timeFormat24Hour,
  timeFormatWithoutSecond,
} from '@/components'
import { computeRRule } from '@/components/_medisys'
import { initialAptInfo } from './variables'

const initDailyRecurrence = {
  recurrencePatternFK: 1,
  recurrenceFrequency: 1,
  recurrenceRange: 'after',
  recurrenceCount: 1,
  recurrenceDaysOfTheWeek: undefined,
  recurrenceDayOfTheMonth: undefined,
}
const endOfMonth = moment().endOf('month').date()

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

export const ValidationSchema = Yup.object().shape({
  patientName: Yup.string().required('Patient Name is required'),
  patientContactNo: Yup.string().required('Contact No. is required'),
  // 'appointment.appointmentDate': Yup.string().required(
  //   'Appointment Date is required',
  // ),
  isEnableRecurrence: Yup.boolean().required(),
  recurrenceDto: Yup.object().when('isEnableRecurrence', {
    is: true,
    then: Yup.object().shape({
      recurrenceDayOfTheMonth: Yup.number()
        .transform((value) => {
          if (Number.isNaN(value)) return -1
          return value
        })
        .when('recurrencePatternFK', {
          is: (recurrencePatternFK) => recurrencePatternFK === 3,
          then: Yup.number()
            .min(1, 'Day of month cannot be less than 1')
            .max(endOfMonth, `Day of month cannot exceed ${endOfMonth}`),
        }),
      recurrenceDaysOfTheWeek: Yup.array()
        .transform((value) => (value === null ? [] : value))
        .when('recurrencePatternFK', {
          is: (recurrencePatternFK) => recurrencePatternFK === 2,
          then: Yup.array()
            .min(1, 'Day(s) of week is required')
            .required('Day(s) of week is required'),
        }),
    }),
  }),
})

export const mapPropsToValues = ({
  viewingAppointment,
  selectedAppointmentID,
  isEditedAsSingleAppointment = false,
  selectedSlot,
  user,
}) => {
  if (viewingAppointment.id) {
    const appointment = viewingAppointment.appointments.find(
      (item) => item.id === selectedAppointmentID,
    )
    const { recurrenceDto } = viewingAppointment

    return {
      ...viewingAppointment,
      overwriteEntireSeries: false,
      recurrenceChanged: false,
      recurrenceDto:
        recurrenceDto === undefined || recurrenceDto === null
          ? { ...initDailyRecurrence }
          : recurrenceDto,
      currentAppointment: { ...appointment },
      appointments: viewingAppointment.appointments.map((item) => ({
        ...item,
      })),
    }
  }
  return {
    isEnableRecurrence: false,
    isEditedAsSingleAppointment: false,
    overwriteEntireSeries: false,
    bookedByUser: user.userName,
    bookedByUserFK: user.id,
    currentAppointment: {
      appointmentDate: parseDateToServerDateFormatString(selectedSlot.start),
      appointments_Resources: [],
    },
    recurrenceDto: { ...initDailyRecurrence },
  }
}

export const mapDatagridToAppointmentResources = (shouldDumpID) => (event) => {
  const { id, startTime: timeFrom, endTime: timeTo, ...restEvent } = event
  const startTime =
    timeFrom.includes('AM') || timeFrom.includes('PM')
      ? moment(timeFrom, timeFormat).format(timeFormat24Hour)
      : timeFrom
  const endTime =
    timeTo.includes('AM') || timeTo.includes('PM')
      ? moment(timeTo, timeFormat).format(timeFormat24Hour)
      : timeTo
  if (id < 0 || shouldDumpID) {
    return { ...restEvent, startTime, endTime }
  }
  return { ...event, startTime, endTime }
}

export const compareDto = (value, original) => {
  console.log({ value, original })
  if (Object.keys(original).length === 0 && Object.keys(value).length > 0)
    return true

  if ((original === null || original === undefined) && value) return true

  if (
    (value === undefined || value === null) &&
    (original === undefined || original === null)
  )
    return false
  let isChanged = false
  Object.keys(original).forEach((key) => {
    if (value[key] === undefined) isChanged = true
    else if (original[key] !== value[key]) isChanged = true
  })
  return isChanged
}

export const generateRecurringAppointments = (
  recurrenceDto,
  appointment,
  shouldGenerate,
  shouldDumpID,
) => {
  if (!shouldGenerate)
    return [
      appointment,
    ]

  const rrule = computeRRule({
    recurrenceDto,
    startDate: appointment.appointmentDate,
  })
  if (rrule) {
    const allDates = rrule.all() || []
    const { id, ...restAppointmentValues } = appointment
    return allDates.map(
      (date) =>
        shouldDumpID || id === undefined
          ? {
              ...restAppointmentValues,
              appointments_Resources: restAppointmentValues.appointments_Resources.map(
                ({ appointmentFK, ...restItem }) => ({ ...restItem }),
              ),
              appointmentDate: parseDateToServerDateFormatString(date),
            }
          : {
              ...restAppointmentValues,
              id,
              appointmentDate: parseDateToServerDateFormatString(date),
            },
    )
  }
  return null
}

export const getRecurrenceLastDate = (recurrences = []) =>
  recurrences.length > 0
    ? moment(recurrences[recurrences.length - 1]).format()
    : undefined

export const filterRecurrenceDto = (recurrenceDto) => {
  const { recurrencePatternFK } = recurrenceDto
  // daily
  if (recurrencePatternFK === 1) {
    return {
      ...recurrenceDto,
      recurrenceDaysOfTheWeek: undefined,
      recurrenceDayOfTheMonth: undefined,
    }
  }
  // weekly
  if (recurrencePatternFK === 2) {
    return {
      ...recurrenceDto,
      recurrenceDayOfTheMonth: undefined,
    }
  }
  // monthly
  if (recurrencePatternFK === 3) {
    return {
      ...recurrenceDto,
      recurrenceDaysOfTheWeek: undefined,
    }
  }
  return { ...recurrenceDto }
}

export const constructPayload = (payload, appointmentStatusFK) => {
  const { overwriteEntireSeries } = payload

  // DRAFT
  if (appointmentStatusFK === 5) {
    return {
      overwriteEntireSeries,
      appointmentGroupDto: payload,
    }
  }
  return payload
}

export const getFirstAppointmentType = (appointment) => {
  if (
    appointment.appointment_Resources &&
    appointment.appointment_Resources.length >= 1
  )
    return appointment.appointment_Resources[0].appointmentTypeFK

  return appointment.appointmentTypeFK
    ? appointment.appointmentTypeFK
    : undefined
}
