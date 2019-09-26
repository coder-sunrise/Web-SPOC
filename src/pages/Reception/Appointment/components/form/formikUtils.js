import moment from 'moment'
import * as Yup from 'yup'
import { serverDateFormat, timeFormat, timeFormat24Hour } from '@/components'
import { computeRRule } from '@/components/_medisys'

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
  isEnableRecurrence: Yup.boolean(),
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

const convertReccurenceDaysOfTheWeek = (week = '') =>
  week.split(', ').map((eachDay) => parseInt(eachDay, 10))

export const mapPropsToValues = ({
  viewingAppointment,
  selectedAppointmentID,
  selectedSlot,
  user,
  clinicianProfiles,
}) => {
  let values = {
    isEnableRecurrence: false,
    isEditedAsSingleAppointment: false,
    overwriteEntireSeries: false,
    bookedByUser: user.clinicianProfile.name,
    bookedByUserFK: user.id,
    currentAppointment: {
      appointmentDate: moment(selectedSlot.start).format(),
      appointments_Resources: [],
    },
    appointmentStatusFk: 2,
    recurrenceDto: { ...initDailyRecurrence },
  }

  try {
    if (viewingAppointment.id) {
      const clinicianProfile =
        clinicianProfiles &&
        clinicianProfiles.find(
          (item) => viewingAppointment.bookedByUserFk === item.userProfileFK,
        )
      const appointment = viewingAppointment.appointments.find(
        (item) => item.id === selectedAppointmentID,
      )
      const { recurrenceDto } = viewingAppointment
      const { appointmentDate, ...restAppointment } = appointment
      values = {
        ...viewingAppointment,
        bookedByUser: clinicianProfile ? clinicianProfile.name : '',
        overwriteEntireSeries: false,
        recurrenceChanged: false,
        recurrenceDto:
          recurrenceDto === undefined || recurrenceDto === null
            ? { ...initDailyRecurrence }
            : {
                ...recurrenceDto,
                recurrenceDaysOfTheWeek: convertReccurenceDaysOfTheWeek(
                  recurrenceDto.recurrenceDaysOfTheWeek,
                ),
              },
        currentAppointment: {
          ...restAppointment,
          appointmentDate: moment(appointmentDate).format(),
        },
        appointmentStatusFk: appointment.appointmentStatusFk,
        appointments: viewingAppointment.appointments.map((item) => ({
          ...item,
        })),
      }
    }
  } catch (error) {
    console.log({ error })
  }

  return values
}

export const mapDatagridToAppointmentResources = (shouldDumpID) => (
  event,
  index,
) => {
  const { id, startTime: timeFrom, endTime: timeTo, ...restEvent } = event
  const startTime =
    timeFrom.includes('AM') || timeFrom.includes('PM')
      ? moment(timeFrom, timeFormat).format(timeFormat24Hour)
      : timeFrom
  const endTime =
    timeTo.includes('AM') || timeTo.includes('PM')
      ? moment(timeTo, timeFormat).format(timeFormat24Hour)
      : timeTo
  const sortOrder = index
  if (id < 0 || shouldDumpID) {
    return { ...restEvent, startTime, endTime }
  }
  return { ...event, startTime, endTime }
}

export const compareDto = (value, original) => {
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
    date: appointment.appointmentDate,
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

export const getFirstAppointmentType = (appointment) => {
  const { appointment_Resources: resources = [] } = appointment

  if (resources.length > 0) {
    const first = resources.find((item) => item.sortOrder === 0)
    return first && first.appointmentTypeFK
  }
  return null
}

export const filterRecurrenceDto = (recurrenceDto) => {
  const { recurrencePatternFK } = recurrenceDto
  // daily
  if (recurrencePatternFK === 1) {
    return {
      ...recurrenceDto,
      recurrenceDaysOfTheWeek: null,
      recurrenceDayOfTheMonth: null,
    }
  }
  // weekly
  if (recurrencePatternFK === 2) {
    return {
      ...recurrenceDto,
      recurrenceDaysOfTheWeek: recurrenceDto.recurrenceDaysOfTheWeek.join(', '),
      recurrenceDayOfTheMonth: null,
    }
  }
  // monthly
  if (recurrencePatternFK === 3) {
    return {
      ...recurrenceDto,
      recurrenceDaysOfTheWeek: null,
    }
  }
  return { ...recurrenceDto }
}
