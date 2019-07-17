import { createListViewModel } from 'medisys-model'
import * as service from '../services/calendar'
import { calendarEvents as defaultEvents } from '../pages/Reception/BigCalendar/events'
import { events as newEvents } from '../pages/Reception/BigCalendar/_appointment'

const deleteApptResources = (eventID, appointmentID) => (events, e) =>
  e.appointmentID === appointmentID
    ? [
        ...events,
        e,
      ]
    : [
        ...events,
        {
          ...e,
          appointmentResources: e.appointmentResources.filter(
            (res) => res.id !== eventID,
          ),
        },
      ]

export default createListViewModel({
  namespace: 'calendar',
  config: {
    queryOnLoad: false,
  },
  param: {
    service,
    state: {
      calendarEvents: [
        ...newEvents,
      ],
    },
    subscriptions: {},
    effects: {},
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

        const newCalendarEvents = calendarEvents.reduce(
          deleteApptResources(eventID, appointmentID),
          [],
        )

        return {
          ...state,
          calendarEvents: newCalendarEvents,
        }
      },
      updateDoctorEvent (state, { added, updated, deleted }) {
        console.log({ added, updated, deleted })
        return { ...state }
      },
      // updateEventListing (state, { added, edited, deleted }) {
      //   const { calendarEvents } = state

      //   let newCalendarEvents = [
      //     ...calendarEvents,
      //   ]

      //   if (added) {
      //     newCalendarEvents = [
      //       ...calendarEvents,
      //       added,
      //     ]
      //   }

      //   if (edited) {
      //     const removeEdited = (event) => event.id !== edited.id
      //     newCalendarEvents = [
      //       ...newCalendarEvents.filter(removeEdited),
      //       edited,
      //     ]
      //   }

      //   if (deleted) {
      //     const removeDeleted = (event) => event.id !== deleted
      //     newCalendarEvents = newCalendarEvents.filter(removeDeleted)
      //   }

      //   return { ...state, calendarEvents: newCalendarEvents }
      // },
    },
  },
})
