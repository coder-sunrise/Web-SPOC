import { createListViewModel } from 'medisys-model'
import * as service from '../services/calendar'
import { notification } from '@/components'
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
    },
    subscriptions: {},
    effects: {
      *deleteDraft ({ id }, { call }) {
        const result = yield call(service.deleteDraft, id)
        console.log({ result })
        notification.sucess({
          message: 'Deleted',
        })
      },
    },
    reducers: {
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
