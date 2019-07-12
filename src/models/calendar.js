import { createListViewModel } from 'medisys-model'
import * as service from '../services/calendar'
import { calendarEvents as defaultEvents } from '../pages/Reception/BigCalendar/events'

export default createListViewModel({
  namespace: 'calendar',
  config: {
    queryOnLoad: false,
  },
  param: {
    service,
    state: {
      calendarEvents: [
        ...defaultEvents,
      ],
    },
    subscriptions: {},
    effects: {},
    reducers: {
      moveEvent (state, { calendarEvents }) {
        return { ...state, calendarEvents }
      },
      addEventSeries (state, { series }) {
        return {
          ...state,
          calendarEvents: [
            ...state.calendarEvents,
            ...series,
          ],
        }
      },
      updateEventSeriesBySeriesID (state, { series, seriesID }) {
        const { calendarEvents: originalEvents } = state
        const removed = originalEvents.filter(
          (event) => event.seriesID !== seriesID,
        )
        const newCalendarEvents = [
          ...removed,
          ...series,
        ]

        return { ...state, calendarEvents: newCalendarEvents }
      },
      deleteEventSeriesBySeriesID (state, { seriesID }) {
        const { calendarEvents } = state
        return {
          ...state,
          calendarEvents: calendarEvents.filter(
            (event) => event.seriesID !== seriesID,
          ),
        }
      },

      updateEventListing (state, { added, edited, deleted }) {
        const { calendarEvents } = state

        let newCalendarEvents = [
          ...calendarEvents,
        ]

        if (added) {
          newCalendarEvents = [
            ...calendarEvents,
            added,
          ]
        }

        if (edited) {
          const removeEdited = (event) => event.id !== edited.id
          newCalendarEvents = [
            ...newCalendarEvents.filter(removeEdited),
            edited,
          ]
        }

        if (deleted) {
          const removeDeleted = (event) => event.id !== deleted
          newCalendarEvents = newCalendarEvents.filter(removeDeleted)
        }

        return { ...state, calendarEvents: newCalendarEvents }
      },
    },
  },
})
