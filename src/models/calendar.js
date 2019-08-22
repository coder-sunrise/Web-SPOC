// big calendar
import BigCalendar from 'react-big-calendar'
// moment
import moment from 'moment'
// common components
import { notification, serverDateFormat } from '@/components'

import { createListViewModel } from 'medisys-model'
import * as service from '../services/calendar'

// import { events as newEvents } from '../pages/Reception/BigCalendar/_appointment'

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
    },
    subscriptions: {},
    effects: {
      *validate ({ payload }, { call, put }) {
        const result = yield call(service.validate, payload)
        console.log({ result })
      },
      *refresh (_, { select, put }) {
        const calendarState = yield select((state) => state.calendar)
        const { date, calendarView } = calendarState
        let start
        let end
        if (calendarView === BigCalendar.Views.MONTH) {
          start = moment(date).startOf('month').format(serverDateFormat)
          end = moment(date).endOf('month').format(serverDateFormat)
        }

        const payload = {
          combineCondition: 'and',
          lgt_appointmentDate: start,
          lst_appointmentDate: end,
        }
        yield put({ type: 'getCalendarList', payload })
      },
      *getAppointmentDetails ({ appointmentID }, { call, put }) {
        const result = yield call(service.query, appointmentID)
        const { status, data } = result
        if (parseInt(status, 10) === 200) {
          yield put({
            type: 'setViewAppointment',
            data,
          })
        }
      },
      *getCalendarList ({ payload }, { call, put }) {
        const result = yield call(service.queryList, payload)
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
      *saveAppointment ({ payload }, { call, put }) {
        const result = yield call(service.save, payload)
        if (result) yield put({ type: 'refresh' })
      },
      *deleteDraft ({ id, callback }, { call, put }) {
        const result = yield call(service.deleteDraft, id)
        if (result === 204) notification.success({ message: 'Deleted' })
        yield put({ type: 'refresh' })
        callback && callback()
      },
      *navigateCalendar ({ date }, { select, call, put }) {
        const calendarState = yield select((state) => state.calendar)
        yield put({
          type: 'setCurrentViewDate',
          date,
        })
        let start
        let end
        if (calendarState.calendarView === BigCalendar.Views.MONTH) {
          start = moment(date).startOf('month').format(serverDateFormat)
          end = moment(date).endOf('month').format(serverDateFormat)
        }

        const payload = {
          combineCondition: 'and',
          lgt_appointmentDate: start,
          lst_appointmentDate: end,
        }
        yield put({ type: 'getCalendarList', payload })
      },
    },
    reducers: {
      setCurrentViewDate (state, { date }) {
        return { ...state, currentViewDate: date }
      },
      setViewAppointment (state, { data }) {
        return { ...state, currentViewAppointment: { ...data } }
      },
      setCalendarView (state, { view }) {
        return { ...state, calendarView: view }
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
