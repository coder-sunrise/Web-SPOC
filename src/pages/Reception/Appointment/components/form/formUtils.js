import moment from 'moment'
import * as Yup from 'yup'
import { serverDateFormat, timeFormat, timeFormat24Hour } from '@/components'
import { computeRRule } from '@/components/_medisys'
import {
  APPOINTMENT_STATUS,
  CALENDAR_RESOURCE,
  CALENDAR_VIEWS,
} from '@/utils/constants'
import { getTimeObject, compare } from '@/utils/yup'
import { getUniqueNumericId, roundTo } from '@/utils/utils'

const initDailyRecurrence = {
  recurrencePatternFK: 1,
  recurrenceFrequency: 1,
  recurrenceRange: 'after',
  recurrenceCount: 1,
  recurrenceDaysOfTheWeek: undefined,
  recurrenceDayOfTheMonth: undefined,
}
const endOfMonth = moment()
  .endOf('month')
  .date()

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
  email: Yup.string()
    .email()
    .required('Email is required'),
  currentAppointment: Yup.object().shape({
    appointmentDate: Yup.string().required(),
  }),
  // isEnableRecurrence: Yup.boolean(),
  // recurrenceDto: Yup.object().when(
  //   ['isEnableRecurrence', 'currentAppointment'],
  //   (isEnableRecurrence, currentAppointment, recurrenceDto) => {
  //     return recurrenceDto.shape({
  //       recurrenceFrequency: Yup.number()
  //         .min(1)
  //         .max(99, 'Frequence must be less than or equal to 99')
  //         .required(),
  //       recurrenceCount: Yup.number()
  //         .min(1)
  //         .max(99, 'Number of Ocurrence must be less than or equal to 99')
  //         .required(),
  //       recurrenceDayOfTheMonth: Yup.number()
  //         .transform(value => {
  //           if (Number.isNaN(value)) return -1
  //           return value
  //         })
  //         .when('recurrencePatternFK', {
  //           is: recurrencePatternFK => recurrencePatternFK === 3,
  //           then: Yup.number()
  //             .min(1, 'Day of month cannot be less than 1')
  //             .max(endOfMonth, `Day of month cannot exceed ${endOfMonth}`),
  //         }),
  //       recurrenceDaysOfTheWeek: Yup.array()
  //         .transform(value => (value === null ? [] : value))
  //         .when('recurrencePatternFK', {
  //           is: recurrencePatternFK => recurrencePatternFK === 2,
  //           then: Yup.array()
  //             .min(1, 'Day(s) of week is required')
  //             .required('Day(s) of week is required'),
  //         }),
  //     })
  //   },
  // ),
})

const convertReccurenceDaysOfTheWeek = (week = '') =>
  week.split(', ').map(eachDay => parseInt(eachDay, 10))

const calculateDuration = (startTime, endTime) => {
  const hour = endTime.diff(startTime, 'hour')
  const minute = roundTo((endTime.diff(startTime, 'minute') / 60 - hour) * 60)
  return { hour, minute }
}

const calculateDurationTime = durationMinutes => {
  const hour = Math.floor(durationMinutes / 60)
  const minute = durationMinutes % 60
  return { hour, minute }
}

const constructDefaultNewRow = (
  selectedSlot,
  apptTimeSlotDuration,
  appointmentTypes,
  ctcalendarresource = [],
) => {
  let defaultNewRow = { id: getUniqueNumericId() }
  selectedSlot = selectedSlot || {}
  const startTime = moment(selectedSlot.start)
  const selectedEndTime = moment(selectedSlot.end)

  const { hour = 0, minute = 15 } = calculateDurationTime(apptTimeSlotDuration)
  const defaultApptType =
    _.orderBy(appointmentTypes, ['sortOrder'], ['asc']).find(
      x => x.isDefault,
    ) || {}
  const endTime = moment(selectedSlot.start)
    .add(hour, 'hour')
    .add(minute, 'minute')
    .format(timeFormat24Hour)
  const resource = ctcalendarresource.find(
    source => source.id === selectedSlot.resourceId,
  )
  defaultNewRow = {
    startTime: startTime.format(timeFormat24Hour),
    calendarResourceFK: selectedSlot.resourceId,
    calendarResource: resource ? { ...resource } : undefined,
    endTime,
    apptDurationHour: hour,
    apptDurationMinute: minute,
    sortOrder: 0,
    appointmentTypeFK: defaultApptType.id,
    ...defaultNewRow,
    isPrimaryClinician: resource?.resourceType === CALENDAR_RESOURCE.DOCTOR,
  }
  return defaultNewRow
}

export const mapPropsToValues = ({
  viewingAppointment,
  selectedAppointmentID,
  selectedSlot,
  patientProfile: patientEntity,
  user,
  clinicianProfiles,
  apptTimeSlotDuration,
  appointmentTypes,
  ctcalendarresource,
  updateEvent,
}) => {
  let _patientProfileFK
  let _patientContactNo
  let _email
  let _patientName
  let _patientAccountNo
  if (patientEntity) {
    const { id, name, patientAccountNo: accNo, contact } = patientEntity
    _patientContactNo = contact.mobileContactNumber.number
    _patientName = name
    _email = contact.contactEmailAddress.emailAddress
    _patientAccountNo = accNo
    _patientProfileFK = id
  }
  let _title = user.clinicianProfile.title
    ? `${user.clinicianProfile.title} `
    : ''
  let values = {
    search: '',
    patientProfileFK: _patientProfileFK,
    patientContactNo: _patientContactNo,
    email: _email,
    patientName: _patientName,
    patientAccountNo: _patientAccountNo,
    isEnableRecurrence: false,
    isEditedAsSingleAppointment: false,
    overwriteEntireSeries: false,
    bookedByUser: `${_title}${user.clinicianProfile.name}`,
    bookedByUserFK: user.id,
    currentAppointment: {
      appointmentDate: moment((selectedSlot || {}).start)
        .startOf('day')
        .formatUTC(),
      appointments_Resources: [
        constructDefaultNewRow(
          selectedSlot,
          apptTimeSlotDuration,
          appointmentTypes,
          ctcalendarresource,
        ),
      ],
    },
    appointmentStatusFk: APPOINTMENT_STATUS.CONFIRMED,

    // recurrenceDto: { ...initDailyRecurrence },
    _appointmentDateIn: true,
    countryCodeFK: 1,
  }

  try {
    if (viewingAppointment.id || viewingAppointment.isFromCopy) {
      const clinicianProfile =
        clinicianProfiles &&
        clinicianProfiles.find(
          item => viewingAppointment.bookedByUserFk === item.userProfileFK,
        )
      let appointment
      let isUpdated
      if (viewingAppointment.isFromCopy) {
        appointment = viewingAppointment.appointments[0]
        isUpdated = true
      } else {
        appointment = viewingAppointment.appointments.find(
          item => item.id === selectedAppointmentID,
        )
      }
      let appointmentDate = appointment.appointmentDate
      let apptResources = appointment.appointments_Resources.map(item => {
        const { calendarResourceFK } = item
        const cp = ctcalendarresource.find(_cp => _cp.id === calendarResourceFK)
        const startTime = moment(item.startTime, timeFormat24Hour)
        const endTime = moment(item.endTime, timeFormat24Hour)
        const { hour, minute } = calculateDuration(startTime, endTime)
        return {
          ...item,
          calendarResourceFK:
            cp && cp.isActive ? calendarResourceFK : undefined,
          startTime: startTime.format(timeFormat24Hour),
          endTime: endTime.format(timeFormat24Hour),
          apptDurationHour: hour,
          apptDurationMinute: minute,
        }
      })

      if (updateEvent) {
        const {
          updateApptResourceId,
          newStartTime,
          newEndTime,
          newResourceId,
          view,
          isAffectAllResource,
        } = updateEvent
        isUpdated = true
        if (
          moment(newStartTime)
            .startOf('day')
            .formatUTC() !== moment(appointment.appointmentDate)
        ) {
          appointmentDate = moment(newStartTime)
            .startOf('day')
            .formatUTC()
        }
        let updateResource = apptResources.find(
          r => r.id === updateApptResourceId,
        )

        let firstStartTime = updateResource.startTime
        if (view !== CALENDAR_VIEWS.MONTH) {
          const startTime = moment(newStartTime, timeFormat24Hour)
          const endTime = moment(newEndTime, timeFormat24Hour)
          const { hour, minute } = calculateDuration(startTime, endTime)
          updateResource.startTime = startTime.format(timeFormat24Hour)
          updateResource.endTime = endTime.format(timeFormat24Hour)
          updateResource.apptDurationHour = hour
          updateResource.apptDurationMinute = minute
          firstStartTime = newStartTime
        }

        if (isAffectAllResource) {
          apptResources.forEach(r => {
            r.startTime = moment(firstStartTime, timeFormat24Hour).format(
              timeFormat24Hour,
            )
            r.endTime = moment(firstStartTime, timeFormat24Hour)
              .add(r.apptDurationHour, 'hours')
              .add(r.apptDurationMinute, 'minutes')
              .format(timeFormat24Hour)
          })
        }

        if (newResourceId) {
          const source = ctcalendarresource.find(
            source => source.id === newResourceId,
          )
          if (source.resourceType === CALENDAR_RESOURCE.RESOURCE) {
            updateResource.isPrimaryClinician = false
          } else if (
            !apptResources.find(
              r => r.id !== updateApptResourceId && r.isPrimaryClinician,
            )
          ) {
            updateResource.isPrimaryClinician = true
          }
          updateResource.calendarResourceFK = newResourceId
          updateResource.calendarResource = { ...source }
        }
      }
      const { recurrenceDto } = viewingAppointment
      let {
        patientContactNo,
        patientName,
        email,
        patientAccountNo,
        patientProfile,
        countryCodeFK,
        ...restViewingAppointment
      } = viewingAppointment

      if (patientProfile) {
        const { name, patientAccountNo: accNo, contactNumbers } = patientProfile
        const _mobileContact = contactNumbers.find(
          item => item.numberTypeFK === 1,
        )
        if (_mobileContact) {
          patientContactNo = parseInt(_mobileContact.number, 10)
          countryCodeFK = _mobileContact.countryCodeFK
        }
        patientName = name
        patientAccountNo = accNo
      }
      _title =
        clinicianProfile && clinicianProfile.title
          ? `${clinicianProfile.title} `
          : ''
      const bookedByUser = clinicianProfile
        ? `${_title}${clinicianProfile.name}`
        : ''
      values = {
        ...restViewingAppointment,
        search: '',
        patientContactNo,
        email,
        patientName,
        patientAccountNo,
        countryCodeFK,
        bookedByUser,
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
          ...appointment,
          appointments_Resources: apptResources,
          appointmentDate: moment(appointmentDate)
            .startOf('day')
            .formatUTC(),
          // appointmentDate,
        },
        appointmentStatusFk: appointment.appointmentStatusFk,
        appointments: viewingAppointment.appointments.map(item => ({
          ...item,
        })),
        _appointmentDateIn: true,
        isUpdated,
      }
    }
  } catch (error) {}

  return values
}

export const mapDatagridToAppointmentResources = shouldDumpID => event => {
  const { id, startTime: timeFrom, endTime: timeTo, ...restEvent } = event
  const startTime =
    timeFrom && (timeFrom.includes('AM') || timeFrom.includes('PM'))
      ? moment(timeFrom, timeFormat).format(timeFormat24Hour)
      : timeFrom
  const endTime =
    timeTo && (timeTo.includes('AM') || timeTo.includes('PM'))
      ? moment(timeTo, timeFormat).format(timeFormat24Hour)
      : timeTo

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
  Object.keys(original).forEach(key => {
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
  if (!shouldGenerate) return [appointment]

  const rrule = computeRRule({
    recurrenceDto,
    date: appointment.appointmentDate,
  })
  if (rrule) {
    const allDates = [...rrule.all()] || []

    const { id, ...restAppointmentValues } = appointment
    return allDates.map(date =>
      shouldDumpID || id === undefined
        ? {
            ...restAppointmentValues,
            appointments_Resources: restAppointmentValues.appointments_Resources.map(
              ({ appointmentFK, ...restItem }) => ({ ...restItem }),
            ),
            appointmentDate: moment(date)
              .startOf('day')
              .formatUTC(),
          }
        : {
            ...restAppointmentValues,
            id,
            appointmentDate: moment(date)
              .startOf('day')
              .formatUTC(),
          },
    )
  }
  return null
}

export const getRecurrenceLastDate = (recurrences = []) =>
  recurrences.length > 0
    ? moment(recurrences[recurrences.length - 1]).formatUTC()
    : undefined

export const getFirstAppointmentType = appointment => {
  const { appointment_Resources: resources = [] } = appointment

  if (resources.length > 0) {
    const first = resources.find(item => item.sortOrder === 0)
    return first && first.appointmentTypeFK
  }
  return null
}

export const filterRecurrenceDto = recurrenceDto => {
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

export const sortDataGrid = (a, b) => {
  const start = getTimeObject(a.startTime)
  const end = getTimeObject(b.startTime)
  const aLessThanB = compare(start, end)
  if (aLessThanB) return -1
  if (!aLessThanB) return 1
  return 0
}

export const getEndTime = row => {
  const { endTime, apptDurationHour, apptDurationMinute, startTime } = row

  if (!startTime) return endTime
  const format =
    startTime.includes('PM') || startTime.includes('AM') ? 'hh:mm A' : 'HH:mm'
  if (apptDurationHour && apptDurationMinute && startTime)
    return moment(startTime, format)
      .add(apptDurationHour, 'hour')
      .add(apptDurationMinute, 'minute')
      .format('HH:mm')

  return endTime
}
