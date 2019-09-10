// big calendar
import BigCalendar from 'react-big-calendar'
// moment
import moment from 'moment'
// medisys model
import { createListViewModel } from 'medisys-model'
// common components
import { notification, serverDateFormat } from '@/components'
import * as service from '../services/calendar'
// utils
import {
  generateRecurringAppointments,
  filterRecurrenceDto,
  mapDatagridToAppointmentResources,
  compareDto,
} from '@/pages/Reception/Appointment/components/form/formikUtils'
import { getTimeObject, compare } from '@/utils/yup'
// import { events as newEvents } from '../pages/Reception/BigCalendar/_appointment'

const ACTION_KEYS = {
  insert: 'insertAppointment',
  save: 'saveAppointment',
  reschedule: 'rescheduleAppointment',
  delete: 'deleteDraft',
}

const sortDataGrid = (a, b) => {
  const start = getTimeObject(a.startTime)
  const end = getTimeObject(b.startTime)
  const aLessThanB = compare(start, end)
  if (aLessThanB) return -1
  if (!aLessThanB) return 1
  return 0
}

const updateApptResources = (oldResources) => (
  currentResources,
  apptResource,
) => {
  const old = oldResources.find(
    (oldItem) => oldItem.sortOrder === apptResource.sortOrder,
  )
  if (old === undefined)
    return [
      ...currentResources,
      { ...apptResource, isDeleted: true },
    ]
  const {
    clinicianFK,
    appointmentTypeFK,
    startTime,
    endTime,
    roomFk,
    isPrimaryClinician,
  } = old
  return [
    ...currentResources,
    {
      ...apptResource,
      clinicianFK,
      appointmentTypeFK,
      startTime,
      endTime,
      roomFk,
      isPrimaryClinician,
    },
  ]
}

export default createListViewModel({
  namespace: 'calendar',
  config: {
    queryOnLoad: false,
  },
  param: {
    service,
    state: {
      calendarEvents: [],
      currentViewDate: new Date(),
      currentViewAppointment: {
        appointments: [],
      },
      calendarView: BigCalendar.Views.MONTH,
      isEditedAsSingleAppointment: false,
    },
    subscriptions: {},
    effects: {
      *submit ({ payload }, { select, call, put }) {
        const calendarState = yield select((state) => state.calendar)
        // const { ltsppointmentstatus } = yield select((state) => state.codetable)
        try {
          const {
            validate,
            formikValues,
            datagrid = [],
            newAppointmentStatusFK,
          } = payload
          const {
            currentAppointment: formikCurrentAppointment,
            appointments: formikAppointments,
            recurrenceDto,
            overwriteEntireSeries,
            ...restFormikValues
          } = formikValues

          const isEdit = formikValues.id !== undefined
          let isRecurrenceChanged =
            formikValues.isEnableRecurrence &&
            compareDto(
              recurrenceDto,
              calendarState.currentViewAppointment.recurrenceDto || {},
            )

          const appointmentResources = datagrid
            .map(mapDatagridToAppointmentResources(isRecurrenceChanged))
            .sort(sortDataGrid)
            .map((item, index) => ({
              ...item,
              sortOrder: index,
            }))

          const currentAppointment = {
            ...formikCurrentAppointment,
            isEditedAsSingleAppointment:
              calendarState.isEditedAsSingleAppointment,
            appointmentStatusFk: newAppointmentStatusFK,
            appointments_Resources: appointmentResources,
          }

          const shouldGenerateRecurrence =
            !isEdit || (isRecurrenceChanged && formikValues.isEnableRecurrence)

          let appointments = []

          if (shouldGenerateRecurrence) {
            appointments = generateRecurringAppointments(
              recurrenceDto,
              currentAppointment,
              formikValues.isEnableRecurrence,
              isRecurrenceChanged,
            )
          } else if (calendarState.isEditedAsSingleAppointment) {
            appointments = [
              currentAppointment,
            ]
          } else {
            /* 
              update all other recurrences
              - appointmentStatusFK
              - appointmentRemarks
              - appointmentsResources
            */
            const newResources = appointmentResources.filter(
              (item) => item.isNew,
            )
            const oldResources = appointmentResources.filter(
              (item) => !item.isNew,
            )

            appointments = formikValues.appointments.reduce(
              (updated, appt) =>
                appt.isEditedAsSingleAppointment && !overwriteEntireSeries
                  ? [
                      ...updated,
                    ]
                  : [
                      ...updated,
                      {
                        ...appt,
                        appointmentStatusFk: newAppointmentStatusFK,
                        appointmentRemarks:
                          currentAppointment.appointmentRemarks,
                        appointments_Resources: [
                          ...newResources,
                          ...appt.appointments_Resources.reduce(
                            updateApptResources(oldResources),
                            [],
                          ),
                        ]
                          .sort(sortDataGrid)
                          .map((item, index) => ({
                            ...item,
                            sortOrder: index,
                          })),
                      },
                    ],
              [],
            )
          }

          // const cancelRecurrence =
          //   formikValues.isEnableRecurrence === false &&
          //   calendarState.currentViewAppointment.isEnableRecurrence === true
          // if (cancelRecurrence) {
          //   isRecurrenceChanged = true
          //   appointments = appointments.map(
          //     (appt) =>
          //       appt.id === currentAppointment.id
          //         ? { ...appt }
          //         : { ...appt, isDeleted: true },
          //   )
          // }

          const recurrence = formikValues.isEnableRecurrence
            ? filterRecurrenceDto(recurrenceDto)
            : null

          let actionKey = ACTION_KEYS.insert
          if (isEdit) actionKey = ACTION_KEYS.save
          if (newAppointmentStatusFK === 5) actionKey = ACTION_KEYS.reschedule
          let savePayload = {
            ...restFormikValues,
            appointments,
            recurrenceDto: recurrence,
          }
          if (validate) {
            yield put({
              type: 'validate',
              payload: savePayload,
            })
            return false
          }
          if (isEdit) {
            savePayload = {
              recurrenceChanged: isRecurrenceChanged,
              overwriteEntireSeries,
              editSingleAppointment: calendarState.isEditedAsSingleAppointment,
              appointmentGroupDto: {
                ...restFormikValues,
                appointments,
                recurrenceDto: recurrence,
              },
            }
          }

          return yield put({
            type: actionKey,
            payload: savePayload,
          })
        } catch (error) {
          console.log({ error })
        }
        return false
      },
      *validate ({ payload }, { call }) {
        return yield call(service.validate, payload)
      },
      *refresh (_, { put }) {
        yield put({ type: 'navigateCalendar', payload: {} })
      },
      *getAppointmentDetails ({ payload }, { call, put }) {
        const result = yield call(service.query, payload)
        const { status, data } = result
        if (parseInt(status, 10) === 200) {
          yield put({
            type: 'setViewAppointment',
            data,
          })
          yield put({
            type: 'setEditType',
            payload: payload.isEditedAsSingleAppointment,
          })
          return true
        }
        return false
      },
      *getCalendarList ({ payload }, { call, put }) {
        const result = yield call(service.queryList, {
          ...payload,
        })
        const { status, data } = result
        if (status === '200' && data.data) {
          yield put({
            type: 'updateState',
            payload: {
              list: data.data,
            },
          })
        }
      },
      *insertAppointment ({ payload }, { call, put }) {
        const result = yield call(service.insert, payload)
        if (result) {
          yield put({ type: 'refresh' })
          notification.success({ message: 'Appointment created' })
          return true
        }
        return false
      },
      *saveAppointment ({ payload }, { call, put }) {
        const result = yield call(service.save, payload)
        if (result) {
          yield put({ type: 'refresh' })
          notification.success({ message: 'Appointment(s) updated' })
          return true
        }
        return false
      },
      *rescheduleAppointment ({ payload }, { call, put }) {
        const result = yield call(service.reschedule, payload)
        if (result) {
          yield put({ type: 'refresh' })
          notification.success({ message: 'Appointment(s) updated' })
          return true
        }
        return false
      },
      *deleteDraft ({ payload, callback }, { call, put }) {
        const result = yield call(service.deleteDraft, payload)
        if (result === 204) notification.success({ message: 'Deleted' })
        yield put({ type: 'refresh' })
        callback && callback()
      },
      *cancelAppointment ({ payload }, { call, put }) {
        const result = yield call(service.cancel, payload)
        if (result && result.status === '200') {
          notification.success({ message: 'Appointment(s) cancelled' })
          yield put({ type: 'refresh' })
          return true
        }
        return false
      },
      *navigateCalendar ({ payload }, { select, call, put }) {
        const calendarState = yield select((state) => state.calendar)
        const { date, view } = payload
        const targetDate =
          date !== undefined ? date : calendarState.currentViewDate
        const targetView =
          view !== undefined ? view : calendarState.calendarView
        yield put({
          type: 'setCurrentViewDate',
          payload: targetDate,
        })
        let start
        let end
        let isDayView = false

        if (targetView === BigCalendar.Views.MONTH) {
          start = moment(targetDate).startOf('month').format(serverDateFormat)
          end = moment(targetDate).endOf('month').format(serverDateFormat)
        }
        if (targetView === BigCalendar.Views.WEEK) {
          start = moment(targetDate).startOf('week').format(serverDateFormat)
          end = moment(targetDate).endOf('week').format(serverDateFormat)
        }
        if (targetView === BigCalendar.Views.DAY) {
          start = moment(targetDate).startOf('day').format(serverDateFormat)
          end = moment(targetDate).endOf('day').format(serverDateFormat)
          isDayView = true
        }

        const getCalendarListPayload = isDayView
          ? {
              eql_appointmentDate: start,
            }
          : {
              combineCondition: 'and',
              lgteql_appointmentDate: start,
              lsteql_appointmentDate: end,
            }

        yield put({ type: 'getCalendarList', payload: getCalendarListPayload })
      },
    },
    reducers: {
      setEditType (state, { payload }) {
        return { ...state, isEditedAsSingleAppointment: payload }
      },
      setCurrentViewDate (state, { payload }) {
        return { ...state, currentViewDate: payload }
      },
      setViewAppointment (state, { data }) {
        return { ...state, currentViewAppointment: { ...data } }
      },
      setCalendarView (state, { payload }) {
        return { ...state, calendarView: payload }
      },
      moveEvent (state, { updatedEvent, id, _appointmentID }) {
        const { calendarEvents } = state
        const appointment = calendarEvents.find(
          (e) => e._appointmentID === _appointmentID,
        )
        if (!appointment) return { ...state }

        const updateAppointmentResource = (Rs, resource) =>
          resource.id !== id
            ? [
                ...Rs,
                { ...resource },
              ]
            : [
                ...Rs,
                { ...resource, ...updatedEvent },
              ]
        const updatedResources = appointment.appointmentResources.reduce(
          updateAppointmentResource,
          [],
        )

        const removed = calendarEvents.filter(
          (event) => event._appointmentID !== _appointmentID,
        )

        const newCalendarEvents = [
          ...removed,
          {
            ...appointment,
            appointmentResources: updatedResources,
          },
        ]

        return { ...state, calendarEvents: newCalendarEvents }
      },
      addEventSeries (state, { series }) {
        return {
          ...state,
          calendarEvents: [
            ...state.calendarEvents,
            series,
          ],
        }
      },
      updateEventSeriesByEventID (state, { series, _appointmentID }) {
        const { calendarEvents: originalEvents } = state
        const removed = originalEvents.filter(
          (event) => event._appointmentID !== _appointmentID,
        )

        const newCalendarEvents = [
          ...removed,
          series,
        ]

        return { ...state, calendarEvents: newCalendarEvents }
      },
      deleteEventSeriesByEventID (state, { eventID, appointmentID }) {
        const { calendarEvents } = state

        const newCalendarEvents = calendarEvents.filter(
          (event) => event._appointmentID !== appointmentID,
        )

        return {
          ...state,
          calendarEvents: newCalendarEvents,
        }
      },
      updateDoctorEvent (state, { add, update, deleted }) {
        let newCalendarEvents = [
          ...state.calendarEvents,
        ]

        if (add) {
          newCalendarEvents = [
            ...state.calendarEvents,
            add,
          ]
        }

        if (update) {
          newCalendarEvents = newCalendarEvents.reduce(
            (events, e) =>
              e._appointmentID === update._appointmentID
                ? [
                    ...events,
                    update,
                  ]
                : [
                    ...events,
                    e,
                  ],
            [],
          )
        }

        if (deleted) {
          newCalendarEvents = newCalendarEvents.reduce(
            (events, e) =>
              e._appointmentID === deleted
                ? [
                    ...events,
                  ]
                : [
                    ...events,
                    e,
                  ],
            [],
          )
        }
        return { ...state, calendarEvents: newCalendarEvents }
      },
    },
  },
})
