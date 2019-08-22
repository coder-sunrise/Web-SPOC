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

export const parseDateToServerDateFormatString = (date, format) => {
  console.log({ date, format })
  if (moment.isMoment(date)) return date.format(serverDateFormat)

  if (format) {
    if (moment(date, format).isValid())
      return moment(date, format).format(serverDateFormat)

    return date
  }

  if (moment(date).isValid()) return moment(date).format(serverDateFormat)

  return date
}

const endOfMonth = moment().endOf('month').date()
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
  events,
  user,
}) => {
  if (viewingAppointment.id) {
    const appointment = viewingAppointment.appointments.find(
      (item) => item.id === selectedAppointmentID,
    )
    const {
      id: appointmentGroupID,
      concurrencyToken,
      bookedByUserFk,
      bookedByUser,
      patientName,
      patientContactNo,
      patientProfileFK,
      isEnableRecurrence,
      recurrenceDto,
    } = viewingAppointment

    return {
      ...viewingAppointment,
      recurrenceDto:
        recurrenceDto === undefined || recurrenceDto === null
          ? { ...initDailyRecurrence }
          : recurrenceDto,
      appointment,
    }
  }
  return {
    isEnableRecurrence: false,
    bookedByUser: user.userName,
    bookedByUserFK: user.id,
    appointment: {
      appointmentDate: parseDateToServerDateFormatString(selectedSlot.start),
      appointments_Resources: [],
    },
    recurrenceDto: { ...initDailyRecurrence },
  }
}

export const getEventSeriesByID = (appointmentID, data) => {
  const appointment = data.find((item) => item.id === appointmentID)
  if (appointment) {
    const { appointment_Resources: apptResources } = appointment
    return apptResources
  }
  return []
}

export const mapDatagridToAppointmentResources = (event, index) => {
  const { id, startTime: timeFrom, endTime: timeTo, ...restEvent } = event
  if (id < 0) {
    const startTime = moment(timeFrom, timeFormat).format(timeFormat24Hour)
    const endTime = moment(timeTo, timeFormat).format(timeFormat24Hour)
    return { ...restEvent, startTime, endTime }
  }
  return { ...event }
}

export const generateRecurringAppointments = (recurrenceDto, appointment) => {
  const rrule = computeRRule({
    recurrenceDto,
    startDate: appointment.appointmentDate,
  })
  if (rrule) {
    const allDates = rrule.all() || []
    console.log({ allDates })
    return allDates.map((date) => ({
      ...appointment,
      appointmentDate: parseDateToServerDateFormatString(date),
    }))
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
