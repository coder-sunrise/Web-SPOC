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
  recurrenceDaysOfTheWeek: [],
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
      updateAllOthers: false,
      recurrenceDto:
        recurrenceDto === undefined || recurrenceDto === null
          ? { ...initDailyRecurrence }
          : recurrenceDto,
      appointment,
    }
  }
  return {
    isEnableRecurrence: false,
    editSingleAppointment: false,
    updateAllOthers: false,
    bookedByUser: user.userName,
    bookedByUserFK: user.id,
    appointment: {
      appointmentDate: parseDateToServerDateFormatString(selectedSlot.start),
      appointments_Resources: [],
    },
    recurrenceDto: { ...initDailyRecurrence },
  }
}

export const mapDatagridToAppointmentResources = (shouldDumpID) => (event) => {
  const { id, startTime: timeFrom, endTime: timeTo, ...restEvent } = event
  if (id < 0) {
    const startTime = moment(timeFrom, timeFormat).format(timeFormat24Hour)
    const endTime = moment(timeTo, timeFormat).format(timeFormat24Hour)
    return { ...restEvent, startTime, endTime }
  }
  return { ...event, [id]: !shouldDumpID }
}

export const compareDto = (value, original) => {
  if (value === undefined || original === undefined) return false
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
  editSingle,
  shouldDumpID,
) => {
  if (editSingle)
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
  const { updateAllOthers, editSingleAppointment } = payload
  console.log({ updateAllOthers, editSingleAppointment, appointmentStatusFK })
  // DRAFT
  if (appointmentStatusFK === 5) {
    return {
      updateAllOthers,
      editSingleAppointment,
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
